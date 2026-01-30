# How to Deploy to GitHub

Since I cannot access your GitHub account directly, follow these simple steps to push your project to the cloud.

## Prerequisites
-   You need a GitHub account.
-   You need to be logged in (or able to log in).

## Step 1: Create a New Repository
1.  Go to [github.com/new](https://github.com/new).
2.  **Repository Name**: `narrative-auditor` (or `ai-partnership-book`).
3.  **Description**: "A Centaur tool for analyzing media bias."
4.  **Public/Private**: Choose **Public** (if you want to share) or **Private** (to keep it hidden).
5.  **Initialize**: Do **NOT** check "Add a README", ".gitignore", or "license". (We already made them).
6.  Click **Create repository**.

## Step 2: Connect and Push
Copy the commands GitHub shows you under **"…or push an existing repository from the command line"**.

They will look like this (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/narrative-auditor.git
git branch -M main
git push -u origin main
```

## Step 3: Run them in Terminal
1.  Open your terminal.
2.  Make sure you are in the project folder:
    ```bash
    cd /Users/ronhiggins/Documents/AI_Partnership_Book
    ```
3.  Paste the commands from GitHub.
4.  Enter your username/password (or Personal Access Token) if prompted.

## Success!
Your code and book are now safe in the cloud.
Only the **code** and **text** were uploaded. Your API keys (`.env`) were kept safe on your computer.
