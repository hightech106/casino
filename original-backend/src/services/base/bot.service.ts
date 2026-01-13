/**
 * Telegram bot service for user creation and management via bot interactions.
 * Handles user registration from Telegram bot context and processes invite codes.
 * Creates user accounts with Telegram user data and referral tracking.
 */
import { UserModel } from "@models/index";

export const createUser = async (ctx): Promise<boolean> => {
    try {
        const TgData = ctx.from
        const { id, first_name, last_name, username } = TgData

        let inviteCode = ''
        if (ctx.message && ctx.message.text) {
            const inviteLinkMatch = ctx.message.text.match(/start (.+)/)
            if (inviteLinkMatch && inviteLinkMatch[1]) {
                inviteCode = inviteLinkMatch[1]
            }
        }

        const query = {
            id,
            first_name,
            last_name,
            name: username,
            avatar:
                'https://t.me/i/userpic/320/eEJtiQT2OtNIEDM1OrmER2tPV_6K0eyN_1p4qbINf2Ji5DC6oFcxfLZOkYF2HI_h.svg',
            parent: inviteCode,
        }

        await UserModel.create(query);
        return true
    } catch (error) {
        console.error('Error saving user to DB:', error.message)
    }
}