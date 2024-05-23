"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const config_1 = __importDefault(require("./config"));
const sendInstagramMessage = (username, password, recipient, message) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ headless: false });
    const page = yield browser.newPage();
    try {
        yield page.goto('https://www.instagram.com/accounts/login/');
        setTimeout(() => {
            console.log("Delayed for 1 second.");
        }, 2000);
        yield page.waitForSelector('button._a9--._ap36._a9_0', { visible: true, timeout: 5000 })
            .then(() => page.click('button._a9--._ap36._a9_0'))
            .catch(() => console.log('No cookie consent dialog found.'));
        // Login
        yield page.waitForSelector('input[name="username"]', { visible: true });
        yield page.type('input[name="username"]', username, { delay: 50 });
        yield page.type('input[name="password"]', password, { delay: 50 });
        yield page.click('button[type="submit"]');
        // Wait for login to complete
        yield page.waitForNavigation({ waitUntil: 'networkidle2' });
        yield page.waitForSelector('div[role="button"][tabindex="0"]:contains("Not now")', { visible: true, timeout: 5000 })
            .then(() => page.click('div[role="button"][tabindex="0"]:contains("Not now")'))
            .catch(() => console.log('No "Not now" button found.'));
        // Go to recipient's profile
        yield page.goto(`https://www.instagram.com/direct/new/`);
        yield page.waitForSelector('button._a9--._ap36._a9_0', { visible: true, timeout: 5000 })
            .then(() => page.click('button._a9--._ap36._a9_0'))
            .catch(() => console.log('No cookie consent dialog found.'));
        // Search for the recipient
        /* await page.waitForSelector('input[name="queryBox"]', { visible: true });
         await page.type('input[name="queryBox"]', recipient, { delay: 50 });
         await page.waitForSelector('div.-qQT3', { visible: true }); // Select the first result
         await page.click('div.-qQT3');
         await page.click('div.rIacr'); // Next button*/
        yield page.goto('https://www.instagram.com/direct/t/101018917968992/');
        // Wait for the message box to appear
        yield page.waitForSelector('p.xat24cr.xdj266r', { visible: true });
        yield page.focus('p.xat24cr.xdj266r');
        yield page.keyboard.type(message, { delay: 50 });
        yield page.waitForSelector('div[role="button"][tabindex="0"]', { visible: true });
        yield page.evaluate(() => {
            const sendButton = Array.from(document.querySelectorAll('div[role="button"][tabindex="0"]')).find(button => button.innerText.trim() === 'Send');
            if (sendButton) {
                sendButton.click();
                setTimeout(() => {
                    console.log('Waited for 2 seconds after clicking the Send button');
                }, 10000);
            }
            else {
                console.log("no such button");
            }
        });
        yield page.evaluate(() => {
            return new Promise(resolve => {
                setTimeout(resolve, 2000);
            });
        });
        console.log('Message sent successfully');
    }
    catch (error) {
        console.error('Error sending message:', error);
    }
    finally {
        yield browser.close();
    }
});
const config = (0, config_1.default)();
sendInstagramMessage(config.username, config.password, config.recipient, config.message);
/*schedule.scheduleJob('0 * * * *', () => {
});*/ 
