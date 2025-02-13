import Puppeteer from 'puppeteer'
import nodeNotifier from 'node-notifier'

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const ps5Link = "https://www.nike.com/ca/launch/t/kobe-6-protro-sail"
// const ps5Link = "https://www.nike.com/ca/launch/t/acg-rufus-dark-obsidian-w"
const delay = '3000'
// const shoeName = "ACG Rufus"
const shoeName = "Kobe 6 Protro"

// Test notification
nodeNotifier.notify({
    title: 'Test Notification',
    message: 'Testing notification system',
    sound: true
}, function(err, response) {
    if (err) console.error('Test notification error:', err);
    console.log('Test notification response:', response);
});

async function checkAvailability(buttonInfo){
    if(buttonInfo.includes('disabled')) {
        console.log("Can't add to cart yet")
        return false
    } else {
        console.log("PS5 AVAILABLE")
        for (let i=0; i < 5; i++){
            nodeNotifier.notify({
                title: 'PS5 AVAILABLE AT BEST BUY',
                message: 'GO GO GO GO'
            })
        }
        return true
    }
}

async function alertAvailability() {
    console.log("SHOES AVAILABLE")
    
    // Add error handling and callback to verify notification
    nodeNotifier.notify(
        {
            title: 'SHOES AVAILABLE AT BEST BUY',
            message: 'GO GO GO GO',
            sound: true, // Enable sound
            timeout: 10, // How long notification stays up
        },
        function(err, response) {
            if (err) console.error('Notification error:', err);
            console.log('Notification response:', response);
        }
    );

    // Also try terminal-notifier directly as fallback
    nodeNotifier.notify({
        title: 'SHOES AVAILABLE',
        message: 'GO GO GO GO',
        sound: true,

    });
}

async function playAlert(browser) {
    const page = await browser.newPage()
    await page.goto("https://www.youtube.com/watch?v=AtPrjYp75uA")
}

async function getAddToCartButtonInfo(page, browser) {
    while(true) {
        setTimeout(async () => {}, delay)
        try{
            console.log("opening page")
            await page.goto(ps5Link)
            const title= await page.waitForSelector('title')
            console.log(title)

            const result = await page.evaluate(async (shoeName) => {
                const kobe = document.body.innerHTML.search(shoeName)
                if (kobe === -1) {
                    console.log("Webpage error: No Kobe Detected")
                    return -1
                }
                const sizeButton = document.getElementById("size_item_radio9.5")
                if (sizeButton !== null) {
                    sizeButton.click()
                    const buyButton = document.getElementsByClassName('buying-tools-cta-button')[0]
                    console.log(buyButton)
                    buyButton.click()
                    return 1
                }
                return 0
            }, shoeName)

            if (result === -1) {
                throw new Error("No kobe??")
            } else if (result === 1) {
                await playAlert(browser)
                return
            } else {
                console.log("Kobe not avail yet")
                continue
            }

        } catch(e){
            console.log('ERROR', e)
            throw e
        }
        }
}

async function buddy(){
    const browser = await Puppeteer.launch({ headless: false, executablePath: chromePath, ignoreDefaultArgs: ['--mute-audio'],
        args: ['--autoplay-policy=no-user-gesture-required'] })
    const page = await browser.newPage()
    await getAddToCartButtonInfo(page, browser)
}

buddy()

