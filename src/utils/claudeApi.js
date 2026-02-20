/**
 * Analyzes a receipt image using Claude Vision API
 * @param {string} imageBase64 - Base64 encoded image data (without data URL prefix)
 * @param {string} mediaType - MIME type (e.g. 'image/jpeg', 'image/png')
 * @param {string} apiKey - Anthropic API key
 * @returns {Promise<ReceiptData>} Parsed receipt data
 */
export async function analyzeReceipt(imageBase64, mediaType, apiKey) {
  const prompt = `You are analyzing a restaurant receipt image. Extract all information carefully and return ONLY a valid JSON object — no markdown, no explanation, just the raw JSON.

Required JSON structure:
{
  "items": [
    {"name": "Item Name", "price": 12.99}
  ],
  "subtotal": 25.50,
  "tax": 2.30,
  "tip": 4.50,
  "flagged": ["list any item names or fields that were unclear or hard to read"]
}

Rules:
- Include every line item from the receipt with its price
- "subtotal" is the pre-tax total (calculate from items if not shown)
- "tax" is the tax amount (not percentage) — set to 0 if not present
- "tip" is the tip amount (not percentage) — set to null if not shown on receipt
- "flagged" lists names of items or fields (subtotal/tax/tip) that were unclear
- All prices must be numbers, not strings
- If a price is illegible, use your best estimate and add the item to flagged`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const text = data.content[0]?.text || '';

  // Extract JSON from the response (in case there's any surrounding text)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse receipt data from response');
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('Invalid JSON in API response');
  }

  // Validate and normalize the response
  return {
    items: (parsed.items || []).map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      name: String(item.name || 'Unknown Item'),
      price: Number(item.price) || 0,
      flagged: (parsed.flagged || []).some(f =>
        f.toLowerCase().includes((item.name || '').toLowerCase())
      ),
    })),
    subtotal: Number(parsed.subtotal) || 0,
    tax: Number(parsed.tax) || 0,
    tip: parsed.tip !== null && parsed.tip !== undefined ? Number(parsed.tip) : null,
    flagged: parsed.flagged || [],
  };
}
