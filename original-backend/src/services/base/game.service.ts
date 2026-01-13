/**
 * Game service for calculating profit, loss, and revenue metrics.
 * Analyzes game outcomes to compute house edge, player winnings, and game profitability.
 * Used for financial reporting and RTP (Return to Player) calculations.
 */
import { CommonGameModel } from "@models/index";

const getProfit = async (game_type: string, dates = []) => {
    const date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(firstDay.getTime() + 2678400000);
    if (dates?.length) {
        firstDay = dates[0];
        lastDay = dates[1];
    }
    let lost = 0;
    let win = 0;
    let input = 0;
    let output = 0;
    const allGames = await CommonGameModel.find({
        status: { $ne: 'BET' },
        game_type,
        createdAt: { $gte: firstDay, $lte: lastDay }
    });
    for (const key in allGames) {
        input += allGames[key].amount;
        if (allGames[key].status === 'DRAW') {
            output += allGames[key].profit;
        }
        if (allGames[key].status === 'WIN') {
            win += allGames[key].profit - allGames[key].amount;
            output += allGames[key].profit;
        }
        if (allGames[key].status === 'LOST') {
            lost += allGames[key].amount - allGames[key].profit;
            output += allGames[key].profit;
        }
    }
    return {
        input,
        output,
        lost,
        win,
        profit: lost - win,
        percent: Number(((output / input) * 100).toFixed(2))
    };
};

export default {
    getProfit,
};
