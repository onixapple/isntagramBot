import puppeteer from 'puppeteer';
import schedule from 'node-schedule';
import getConfig from './config'

const sendInstagramMessage = async (username: string, password: string, recipient: string, message: string) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto('https://www.instagram.com/accounts/login/');
        setTimeout(() => {
            console.log("Delayed for 1 second.");
        }, 2000);
        await page.waitForSelector('button._a9--._ap36._a9_0', { visible: true, timeout: 5000 })
            .then(() => page.click('button._a9--._ap36._a9_0'))
            .catch(() => console.log('No cookie consent dialog found.'));
        // Login
        await page.waitForSelector('input[name="username"]', { visible: true });
        await page.type('input[name="username"]', username, { delay: 50 });
        await page.type('input[name="password"]', password, { delay: 50 });
        await page.click('button[type="submit"]');

        // Wait for login to complete
        await page.waitForNavigation({ waitUntil: 'networkidle2' });


        await page.waitForSelector('div[role="button"][tabindex="0"]:contains("Not now")', { visible: true, timeout: 5000 })
            .then(() => page.click('div[role="button"][tabindex="0"]:contains("Not now")'))
            .catch(() => console.log('No "Not now" button found.'));


        // Go to recipient's profile
        await page.goto(`https://www.instagram.com/direct/new/`);
        await page.waitForSelector('button._a9--._ap36._a9_0', { visible: true, timeout: 5000 })
            .then(() => page.click('button._a9--._ap36._a9_0'))
            .catch(() => console.log('No cookie consent dialog found.'));
        // Search for the recipient
        /* await page.waitForSelector('input[name="queryBox"]', { visible: true });
         await page.type('input[name="queryBox"]', recipient, { delay: 50 });
         await page.waitForSelector('div.-qQT3', { visible: true }); // Select the first result
         await page.click('div.-qQT3');
         await page.click('div.rIacr'); // Next button*/
        await page.goto('https://www.instagram.com/direct/t/101018917968992/');
        // Wait for the message box to appear
        await page.waitForSelector('p.xat24cr.xdj266r', { visible: true });
        await page.focus('p.xat24cr.xdj266r');
        await page.keyboard.type(message, { delay: 50 });

        await page.waitForSelector('div[role="button"][tabindex="0"]', { visible: true });
        await page.evaluate(() => {
            const sendButton = Array.from(document.querySelectorAll('div[role="button"][tabindex="0"]')).find(button => (button as HTMLElement).innerText.trim() === 'Send');
            if (sendButton) {
                (sendButton as HTMLElement).click();
                setTimeout(() => {
                    console.log('Waited for 2 seconds after clicking the Send button');
                }, 10000);
            } else {
                console.log("no such button")
            }
                
        });
        await page.evaluate(() => {
            return new Promise(resolve => {
                setTimeout(resolve, 2000);
            });
        });
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
    } finally {
        await browser.close();
    }
};

const config = getConfig()

schedule.scheduleJob('0 * * * *', async () => {
   await sendInstagramMessage(config.username, config.password, config.recipient, config.message);
});