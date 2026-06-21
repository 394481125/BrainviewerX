import fs from 'fs';
import https from 'https';
import { spinsData } from './src/spins_data.ts';

async function translateText(text) {
    if (!text.trim()) return text;
    const q = encodeURIComponent(text);
    return new Promise((resolve) => {
        https.get('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=' + q, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const j = JSON.parse(data);
                    resolve(j[0].map(x => x[0]).join(''));
                } catch(e) {
                    resolve(text);
                }
            });
        }).on('error', () => resolve(text));
    });
}

async function scrapeYeo17() {
    // Extract Yeo17 URLs
    // spinsData format: manually construct
    const yeo17 = [
      "visual_a_bilateral",
      "visual_b_bilateral",
      "somatomotor_a_bilateral",
      "somatomotor_b_bilateral",
      "temporal_parietal_bilateral",
      "dorsal_attention_a_bilateral",
      "dorsal_attention_b_bilateral",
      "salience_venattn_a_bilateral",
      "salience_venattn_b_bilateral",
      "limbic_a_bilateral",
      "limbic_b_bilateral",
      "control_a_bilateral",
      "control_b_bilateral",
      "control_c_bilateral",
      "default_a_bilateral",
      "default_b_bilateral",
      "default_c_bilateral"
    ];

    const translations = {};

    for (const url of yeo17) {
        console.log(`Fetching ${url}...`);
        const fullUrl = `https://masilab.github.io/SPINS/Yeo17_renders/${url}/`;
        try {
            const html = await new Promise((resolve, reject) => {
                https.get(fullUrl, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => resolve(data));
                }).on('error', reject);
            });
            
            // Extract overview paragraphs
            // <h2 id="overview">Overview</h2>\n\n<p>...</p>\n\n<p>...</p>
            const matched = html.match(/<h2 id="overview">Overview<\/h2>\s*(<p>.*?<\/p>)\s*(<p>.*?<\/p>)/s);
            if (matched) {
                const p1 = matched[1].replace(/<[^>]+>/g, '').replace(/[\r\n]+/g, ' ').trim();
                const p2 = matched[2].replace(/<[^>]+>/g, '').replace(/[\r\n]+/g, ' ').trim();
                
                console.log(`Translating...`);
                const tp1 = await translateText(p1);
                const tp2 = await translateText(p2);
                translations[url] = { p1: tp1, p2: tp2 };
            }
        } catch(e) {
            console.error(`Error on ${url}`, e.message);
        }
    }

    fs.writeFileSync('src/yeo17_translations.json', JSON.stringify(translations, null, 2));
    console.log("Done!");
}

scrapeYeo17();
