import { wowLog } from "../src/index.js";

wowLog.addContext({userId:"123"})
wowLog.info('This message will have the context.');
wowLog.writeHeading("Test Heading")