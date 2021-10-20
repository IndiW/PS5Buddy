import Puppeteer from 'puppeteer'
import nodeNotifier from 'node-notifier'

const chromePath = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
const ps5Link = "https://www.bestbuy.ca/en-ca/product/playstation-5-digital-edition-console-with-astro-s-playroom/15689335"
const delay = '30000'
async function checkAvailability(buttonInfo){
    if(buttonInfo.includes('disabled')) {
        console.log("Can't add to cart yet")
        return false
    } else {
        console.log("PS5 AVAILABLE")
        for (const i=0; i < 5; i++){
        nodeNotifier.notify({
            title: 'PS5 AVAILABLE AT BEST BUY',
            message: 'GO GO GO GO'
        })
        
    }
    return true
    }
}

async function getAddToCartButtonInfo(page) {
    try{
    await page.goto(ps5Link)
    const title= await page.waitForSelector('title')
    const titleInfo = await (await title.getProperty('innerHTML')).jsonValue()
    if (!titleInfo.includes('PlayStation 5')) {
        console.log("Webpage error: No PS5 Detected")
        throw 'No PS5 Detected'
    }
    const button = await page.waitForSelector('.button_2m0Gt')
    // console.log(await (await title.getProperty('innerHTML')).jsonValue())
    const buttonInfo = await (await button.getProperty('outerHTML')).jsonValue()
    if (button) { 
        return buttonInfo
    } else {
        console.log("Webpage error: Couldn't read button properly")
        throw 'Couldnt read button properly'
    }
} catch(e){
    console.log('ERROR', e)
}
}

async function buddy(){
    const browser = await Puppeteer.launch({ headless: false, executablePath: chromePath })
    const page = await browser.newPage()
    var buttonInfo = await getAddToCartButtonInfo(page)
    while(!await checkAvailability(buttonInfo)){
        setTimeout(()=>{},delay)
        buttonInfo = await getAddToCartButtonInfo(page)

    }
    console.log("Buddy stopped")
    browser.close()
}

buddy()

