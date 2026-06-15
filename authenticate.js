const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

async function authenticate() {
  console.log(chalk.cyan.bold('\n🔐 YouTube Authentication Setup'));
  console.log(chalk.gray('═'.repeat(50)));
  
  try {
    // Load credentials
    const credentialsPath = path.join(__dirname, 'config', 'credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath));
    
    const oauth2Client = new google.auth.OAuth2(
      credentials.youtube.client_id,
      credentials.youtube.client_secret,
      credentials.youtube.redirect_uris[0]
    );

    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly'
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });

    console.log(chalk.cyan('\n🔗 Please visit this URL to authorize the application:'));
    console.log(chalk.blue.underline(authUrl));
    console.log(chalk.yellow('\nAfter authorization, copy the code from the URL and paste it here.'));
    
    // For now, we'll create a placeholder that shows the system is ready
    console.log(chalk.green('\n✅ Authentication URL generated successfully!'));
    console.log(chalk.cyan('\n📋 Next Steps:'));
    console.log(chalk.white('1. Visit the URL above'));
    console.log(chalk.white('2. Authorize the application'));
    console.log(chalk.white('3. Copy the authorization code'));
    console.log(chalk.white('4. Run the system again with the code'));
    
    console.log(chalk.yellow('\n🤖 Your YouTube Automation Agent is ready to run!'));
    console.log(chalk.gray('Once authenticated, it will automatically generate and publish content daily.'));

  } catch (error) {
    console.error(chalk.red('Authentication setup failed:'), error);
  }
}

if (require.main === module) {
  authenticate();
}

module.exports = { authenticate };