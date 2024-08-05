const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();
const Anthropic = require("@anthropic-ai/sdk"); 

async function transcribeAudio(filePath) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('model', 'whisper-1');

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/audio/transcriptions',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data.text;
    } catch (error) {
        console.error('Error during transcription:', error.response ? error.response.data : error.message);
        throw new Error('Transcription failed');
    }
}

function getPromptByCategory(label, transcript) {
    console.log(`Category received: ${label}`);

    switch (label) {
        case 'Title':
            return `Revise the following transcript, focusing on:

Correcting grammatical errors
Ensuring logical coherence
Maintaining a professional, legal drafting tone
Preserving the original language (English or Hindi)

Provide only the corrected text, without any introductory phrases or explanations."${transcript}"`;

        case 'Facts':
            return `Revise the following transcript, focusing on:

Correcting grammatical errors
Ensuring logical coherence
Maintaining a professional, legal drafting tone
Preserving the original language (English or Hindi)

Provide only the corrected text, without any introductory phrases or explanations."${transcript}"`;

        case 'Court':
            return `Revise the following transcript, focusing on:

Correcting grammatical errors
Ensuring logical coherence
Maintaining a professional, legal drafting tone
Preserving the original language (English or Hindi)

Provide only the corrected text, without any introductory phrases or explanations."${transcript}"`;

        case 'Court Fees':
            return `Revise the following transcript, focusing on:

Correcting grammatical errors
Ensuring logical coherence
Maintaining a professional, legal drafting tone
Preserving the original language (English or Hindi)

Provide only the corrected text, without any introductory phrases or explanations."${transcript}"`;
            
            case 'Ground':
                return `Revise the following transcript, focusing on:

Correcting grammatical errors
Ensuring logical coherence
Maintaining a professional, legal drafting tone
Preserving the original language (English or Hindi)

Provide only the corrected text, without any introductory phrases or explanations."${transcript}"`;
    
            case 'Prayer':
                return `Revise the following transcript, focusing on:

Correcting grammatical errors
Ensuring logical coherence
Maintaining a professional, legal drafting tone
Preserving the original language (English or Hindi)

Provide only the corrected text, without any introductory phrases or explanations."${transcript}"`;

        default:
            console.warn('Using default prompt');
            return `Revise the following transcript, focusing on:

Correcting grammatical errors
Ensuring logical coherence
Maintaining a professional, legal drafting tone
Preserving the original language (English or Hindi)

Provide only the corrected text, without any introductory phrases or explanations."${transcript}"`;
    }
}

async function getChatCompletion(label, transcript) {
    const prompt = getPromptByCategory(label, transcript);
    console.log(`Prompt: ${prompt}`);

    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
    });

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 1000,
            temperature: 0,
            messages: [{ role: 'user', content: prompt }]
        });

        if (msg.content && msg.content.length > 0) {
            const content = msg.content[0];
            if (content.type === 'text') {
                return content.text.trim();
            } else {
                throw new Error('Unexpected content type in the response');
            }
        } else {
            throw new Error('No content in the response');
        }
    } catch (error) {
        console.error('Error during chat completion:', error);
        throw new Error('Chat completion failed');
    }
}

module.exports = {
    transcribeAudio,
    getChatCompletion
};