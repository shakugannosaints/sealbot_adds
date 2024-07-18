// ==UserScript==
// @name         LaTeX Image Renderer
// @author       冷筱华
// @version      1.0.0
// @description  Renders LaTeX formulas as images using Codecogs API and sends them via CQ codes.
// @timestamp   2024-7-18
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

if (!seal.ext.find("latex-image-renderer")) {
    const ext = seal.ext.new("latex-image-renderer", "冷筱华", "1.0.0");
    // LaTeX渲染命令
    const cmdLatex = seal.ext.newCmdItemInfo();
    cmdLatex.name = "latex";
    cmdLatex.help = ".latex <公式> 将LaTeX公式渲染为图片并发送。";
    cmdLatex.solve = async (ctx, msg, cmdArgs) => {
        let formula = cmdArgs.getArgN(1);

        if (!formula) {
            seal.replyToSender(ctx, msg, "请输入LaTeX公式...");
            return seal.ext.newCmdExecuteResult(false);
        }

        // 调用Codecogs API渲染公式为图片
        const imageUrl = `https://latex.codecogs.com/png.image? ${encodeURIComponent(formula)}`;

        // 使用CQ码发送图片
        const messageRet = `[CQ:image,file=${imageUrl}]`;
        seal.replyToSender(ctx, msg, messageRet);

        return seal.ext.newCmdExecuteResult(true);
    };

    // 注册扩展和命令
    seal.ext.register(ext);
    ext.cmdMap['latex'] = cmdLatex;
}