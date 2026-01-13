/**
 * Telegram bot menu and command handlers.
 * Defines bot commands (help, start) and manages active form state to prevent command conflicts.
 * Integrates with Grammy framework for Telegram bot interactions.
 */
import { Composer } from "grammy";
// import {
//   sendAdminMessage,
//   sendCheckSubscribeMessage,
//   sendStartMessage,
// } from "./messages";
import { CALLBACK_CHECK_SUBSCRIBE, CALLBACK_MENU } from "@config/static";
import { BotContext } from "@root/types/config.type";

const menu = new Composer<BotContext>();


export const disableCommand = async (ctx): Promise<boolean> => {
  if (ctx.session.activeForm && ctx.session.activeForm !== null) {
      await ctx.reply(
          'Please finish answering the bot before starting new commands.'
      )
      return true
  }

  return false
}


const helpCommand = async (ctx): Promise<void> => {
  if (await disableCommand(ctx)) {
      return
  }

  const commands = [
      {
          command: '/open',
          description: 'Start MiniApp'
      },
      { command: '/help', description: 'List all commands available' }
  ]

  const helpMessageCommands = commands
      .map((cmd) => `${cmd.command}-${cmd.description}`)
      .join('\n\n')
  const helpMessage =
      'The commands available for this bot are the followings:\n\n' +
      helpMessageCommands

  await ctx.reply(helpMessage)
}

menu.command('help', helpCommand)

menu.command('start', helpCommand)

// menu.command(["admin"], (ctx) => sendAdminMessage(ctx));

export default menu;
