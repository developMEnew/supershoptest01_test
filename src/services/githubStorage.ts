import { Octokit } from '@octokit/rest';
import { encode } from 'base-64';
import { GITHUB_CONFIG } from '../config/github';
import toast from 'react-hot-toast';
import type { BookItem } from '../types';

const octokit = new Octokit({ auth: GITHUB_CONFIG.token });

async function getFileSha(path: string): Promise<string | null> {
  try {
    const response = await octokit.repos.getContent({
      owner: GITHUB_CONFIG.owner,
      repo: GITHUB_CONFIG.repo,
      path,
      ref: GITHUB_CONFIG.branch,
    });

    if ('sha' in response.data) {
      return response.data.sha;
    }
    return null;
  } catch (error) {
    if ((error as any).status === 404) {
      return null;
    }
    throw error;
  }
}

export async function uploadImageToGitHub(imageBlob: Blob, fileName: string): Promise<string> {
  try {
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
    reader.readAsDataURL(imageBlob);
    
    const base64Data = await base64Promise;
    const base64Content = base64Data.split(',')[1];
    
    const path = `${GITHUB_CONFIG.paths.images}/${fileName}`;
    const sha = await getFileSha(path);
    
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_CONFIG.owner,
      repo: GITHUB_CONFIG.repo,
      path,
      message: `Add image: ${fileName}`,
      content: base64Content,
      branch: GITHUB_CONFIG.branch,
      ...(sha && { sha }),
    });

    return `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${path}`;
  } catch (error) {
    console.error('Error uploading to GitHub:', error);
    toast.error('Failed to upload image to GitHub');
    throw error;
  }
}

export async function fetchBooks(): Promise<BookItem[]> {
  try {
    const response = await octokit.repos.getContent({
      owner: GITHUB_CONFIG.owner,
      repo: GITHUB_CONFIG.repo,
      path: GITHUB_CONFIG.paths.data,
      ref: GITHUB_CONFIG.branch,
    });

    if ('content' in response.data) {
      const content = Buffer.from(response.data.content, 'base64').toString();
      return JSON.parse(content);
    }
    return [];
  } catch (error) {
    if ((error as any).status === 404) {
      return [];
    }
    throw error;
  }
}

export async function saveBooks(books: BookItem[]): Promise<void> {
  try {
    const content = JSON.stringify(books, null, 2);
    const sha = await getFileSha(GITHUB_CONFIG.paths.data);

    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_CONFIG.owner,
      repo: GITHUB_CONFIG.repo,
      path: GITHUB_CONFIG.paths.data,
      message: 'Update books data',
      content: encode(content),
      branch: GITHUB_CONFIG.branch,
      ...(sha && { sha }),
    });
  } catch (error) {
    console.error('Error saving books:', error);
    toast.error('Failed to save books data');
    throw error;
  }
}