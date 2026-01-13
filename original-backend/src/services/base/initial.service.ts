/**
 * Initialization service for seeding default game configurations.
 * Sets up default RTP (Return to Player) and GGR (Gross Gaming Revenue) values for all game types.
 * Run once during application setup to ensure all games have proper default configurations.
 */
import path from 'path';
import fs from 'fs-extra';
import { GameRTPModel, GameGGRModel } from '../../models/index';

const GAME_LIST = [
    "keno"
]


const seedDefaultRTP = async () => {
    try {
        console.log('Seeding default RTP values...');
        for (const game of GAME_LIST) {
            const existing = await GameRTPModel.findOne({ game_type: game });
            if (!existing) {
                await GameRTPModel.create({ game_type: game, rtp: 98 });
                console.log(`Seeded default RTP value (98) for game_type "${game}"`);
            } else {
                console.log(`Default RTP value already exists for game_type "${game}"`);
            }
        }
    } catch (error) {
        console.log('Error seeding default RTP:', error);
    }
};

const seedDefaultGGR = async () => {
    try {
        console.log('Seeding default GGR values...');
        for (const game of GAME_LIST) {
            const existing = await GameGGRModel.findOne({ game_type: game });
            if (!existing) {
                await GameGGRModel.create({ 
                    game_type: game, 
                    total_bets: 0,
                    total_wins: 0,
                    ggr: 0,
                    currency: 'USD'
                });
                console.log(`Seeded default GGR values for game_type "${game}"`);
            } else {
                console.log(`Default GGR values already exist for game_type "${game}"`);
            }
        }
    } catch (error) {
        console.log('Error seeding default GGR:', error);
    }
};

const createFolder = () => {
    const base = path.join(__dirname, '..', '..', 'public');
    fs.mkdirsSync(path.join(base, 'avatar'));
    fs.mkdirsSync(path.join(base, 'default'));
};

const initTables = async () => {
    try {
        await createFolder();
        await seedDefaultRTP();
        await seedDefaultGGR();
    } catch (error) {
        console.log('---Admin && Folder Initialization Error---');
        console.log(error);
    }
};
initTables();
