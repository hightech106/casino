/**
 * Telegram bot middleware for user registration and referral handling.
 * Checks if users are registered and processes referral links from invite messages.
 * Currently contains commented-out registration logic that may be re-enabled.
 */
import { NextFunction } from 'grammy';
// import UserHelper from '../../../helpers/UserHelper';
import { BotContext } from "@root/types/config.type";

const REFERRAL_BONUS = 1000;
const REFEREE_BONUS = 0;

const getBotLanguage = (ctx: BotContext) => {
    //return (ctx.from.language_code ?? 'ru') === 'ru' ? 'ru' : 'en'
    return "en";
};

async function checkRegister(ctx: BotContext, next: NextFunction) {
    try {
        if (!ctx.from || !ctx.from.id) {
            await next();
            return;
        }

        let inviteLink = null;
        if (ctx.message && ctx.message.text) {
            const inviteLinkMatch = ctx.message.text.match(/start (.+)/);
            if (inviteLinkMatch && inviteLinkMatch[1]) {
                inviteLink = inviteLinkMatch[1];
            }
        }
        console.log(ctx, "===>ctx");

        // const user = new UserHelper(ctx.from.id);
        // const isRegistered = await user.isRegistered();
        // const username = ctx.from?.username ?? 'User';

        // if (!isRegistered) {
        //     const lang = getBotLanguage(ctx);
        //     let hasReferral = false;

        //     if (inviteLink) {
        //         const referralRegex = /_(.+)$/;
        //         const match = inviteLink.match(referralRegex);
        //         if (match && match[1]) {
        //             // referral
        //             const invitedId = match[1];

        //             console.log('Invite Id:', invitedId);

        //             const invitedUser = new UserHelper(Number(invitedId));
        //             if ((await invitedUser.isRegistered()) && Number(invitedId) !== ctx.from.id) {
        //                 await user.register(Number(invitedId), lang, username);
        //                 await invitedUser.addWPTS(REFERRAL_BONUS);
        //                 hasReferral = true;
        //             }

        //             await next();
        //             return;
        //         }
        //     }

        //     await user.register(null, lang, username);
        //     await next();
        //     return;
        // } else {
        //     try {
        //         if (username !== 'User') {
        //             await user.set({ username: username });
        //         }
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }

        await next();
    } catch (error) {
        console.error(error);

        try {
            await next();
        } catch (e) {
            console.error(e);
        }
    }
}

export default checkRegister;
