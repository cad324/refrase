import { Configuration, OpenAIApi } from "openai";
const dotenv = require('dotenv');
const axios = require('axios');
const cheerio = require('cheerio');

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile });

const config = new Configuration({
    organization: process.env.OPEN_AI_ORG,
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(config);

export interface GenerateThreadProps {
    url: string,
    tweetCount: number,
    tone?: string
}

interface TwitterThreadGenerationResult {
    tweets?: string[];
    error?: unknown;
    code?: number;
}

function listTweets(num: number) {
    let tweets = '';
    for (let i = 1; i <= num; i++) {
        tweets += `- Tweet ${i}:\n`;
    }
    return tweets;
}

function isValidURL(url: string) {
    const pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return pattern.test(url);
};

async function parseHtml(url: string): Promise<string> {
    if (!isValidURL(url)) return '';
    try {
        const response = await axios.get(url);
        const html = response.data;
    
        // Load the HTML into cheerio
        const $ = cheerio.load(html);
        $('body style, body script').remove();
    
        return $('body').text();
    } catch (error) {
        console.error('Error fetching and parsing HTML:', error);
        return '';
    }
}

export async function generateTwitterThread(blogPostLink: string, numOfTweets = 5, tone: string = 'informative'): Promise<TwitterThreadGenerationResult> {
    if (numOfTweets > 25 || numOfTweets < 2) return {error: "Invalid number of tweets", code: 400};
    if (!isValidURL(blogPostLink)) return {error: "Invalid Url", code: 400};

    const blogContent = await parseHtml(blogPostLink);
    console.log('[BLOG CONTENT]', blogContent);

    const prompt = `Mention the most important points from the body of the blog. 
    Each tweet should cover something unique from the blog and flow like a narrative. 
    Your tone should be ${tone}.\nHere's the blog content: ${blogContent}\nGenerate a series of ${numOfTweets} tweets that cover the main points of the blog post. 
    Limit 280 characters each but try to use close to 280 characters for each where possible. No hashtags, pound sign or number sign allows. Use the following format:
    \n${listTweets(numOfTweets)}`;

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 280 * numOfTweets,
            temperature: 1,
        });
        const tweets = response.data.choices as {text: string}[];
        const fixedTweets = tweets.map(tweet => 
            tweet.text.split(/Tweet \d+: /).slice(1)
        );
        return {tweets: fixedTweets[0].map(tweet => tweet.trim())};
    } catch (error) {
        return {error, code: 500};
    }
}
