/**
 * @file 打包相关
 */

import webpack from 'webpack';
import ora from 'ora';
import chalk from 'chalk';
import webpackConfig from './webpack.config';

/* eslint-disable no-console */

process.env.NODE_ENV = 'production';

// 使用 ora 打印出 loading + log
const spinner = ora('building for production...');

// 开始 loading 动画
spinner.start();

webpack(webpackConfig,  (err, stats) => {
    // 编译成功的回调函数
    spinner.stop();
    if (err) {
        throw err;
    }

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
    }));

    process.stdout.write('\n');

    if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'));
        process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'));
    process.exit(0);
});
