/**
 * @file 打包相关
 */

import webpack from 'webpack';
import webpackConfig from '../webpack.config';
import ora from 'ora';
import chalk from 'chalk';

process.env.NODE_ENV = 'production';

// 使用 ora 打印出 loading + log
const spinner = ora('building for production...');
spinner.start(); // 开始 loading 动画

webpack(webpackConfig, function (err, stats) {
    // 编译成功的回调函数
    spinner.stop();
    if (err) {
        throw err
    }

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n');

    if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'));
        process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'));
    process.exit(0);
});
