/**
 * Cron job service for scheduled cleanup tasks.
 * Automatically deletes old game history records (crash, slide, baccarat, hilo) after 20 hours.
 * Runs periodic maintenance to prevent database bloat from inactive game sessions.
 */
import moment from 'moment';
import { CrashModel, SlideModel, BaccaratModel, HiloMModel } from '@models/index';
import { CronJob } from 'cron';

const deleteCrashHistory = async () => {
    const thresholdDate = moment().subtract(20, 'hours').toDate(); // Calculate date 20 hours ago
    const result = await CrashModel.deleteMany({ players: {}, createdAt: { $lt: thresholdDate } });
    console.log(`${result.deletedCount} Crash documents deleted.`, new Date());
};

const deleteSlideHistory = async () => {
    const thresholdDate = moment().subtract(20, 'hours').toDate(); // Calculate date 20 hours ago
    const result = await SlideModel.deleteMany({ players: [], createdAt: { $lt: thresholdDate } });
    console.log(`${result.deletedCount} Slide documents deleted.`, new Date());
};

const deleteBaccaratHistory = async () => {
    const thresholdDate = moment().subtract(20, 'hours').toDate(); // Calculate date 20 hours ago
    const result = await BaccaratModel.deleteMany({ bets: [], createdAt: { $lt: thresholdDate } });
    console.log(`${result.deletedCount} Baccarat documents deleted.`, new Date());
};

const deleteHiloHistory = async () => {
    const thresholdDate = moment().subtract(20, 'hours').toDate(); // Calculate date 20 hours ago
    const result = await HiloMModel.deleteMany({ bets: [], createdAt: { $lt: thresholdDate } });
    console.log(`${result.deletedCount} Hilo documents deleted.`, new Date());
};

export const initCron = () => {
    deleteCrashHistory();
    deleteSlideHistory();
    deleteBaccaratHistory();
    deleteHiloHistory();

    const job = new CronJob('0 */20 * * *', function () {
        deleteCrashHistory();
        deleteSlideHistory();
        deleteBaccaratHistory();
        deleteHiloHistory();
    });

    job.start();
};
