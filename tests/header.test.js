const puppeteer = require('puppeteer')
const sessionFactory =require('./factories/sessionFactories')
const userFactory = require('./factories/userfactories');
let browser, page;
//to open browser before every test case to be excecuted
beforeEach(async () => {
    //opens new browser
    browser = await puppeteer.launch({
     // to show the graphical interface
    headless: false
    });
    //opens new page in the browser
    page = await browser.newPage();
    await page.goto('localhost:3000');
})
   //to close browser after every test case exccecuted
afterEach(async () => {
   await browser.close();
})
test('The header has the correct test', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});
test('clicking login',async()=>{
    await page.click('.right a');
   const url = await page.url(); 
   expect(url).toMatch(/accounts\.google\.com/);
})
//faking server for out test case
test.only('when sign in show logout button',async ()=>{
const user = await userFactory();
const {session, sig} = await sessionFactory(user);
const Buffer = require('safe-buffer').Buffer;


await page.setCookie({ name:'session', value: session });
await page.setCookie({ name:'session.sig', value: sig });
await page.goto('localhost:3000');
await page.waitFor('a[href="auth/logout"]');
const text = await page.$eval('a[href="auth/logout"]',el=>element.innerHTML)
expect(text).toMatch('Logout')
})