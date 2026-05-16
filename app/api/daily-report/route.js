import { NextResponse } from 'next/server';

// 精选池内联（避免导入路径问题）
const POOL = [
  // 手机端 10 条
  {title:"手机做小红书代写月入8千",device:"手机",idea:"本地商家想做小红书但不会写。用手机AI生成种草笔记按篇收费，零成本纯手机。需求巨大，商家痛点是不懂文案+没时间。你卖的是'AI效率+基础SEO'。",target:"美容/餐饮/健身房老板，有小红书但粉丝<5000",cost:"1天+¥0",revenue:"保守¥2,000/月·10篇 | 乐观¥8,000/月·40篇 | 爆发¥15,000/月·包月",difficulty:"低·会用手机+AI即可",actions:["AI生成5篇不同行业种草模板","免费帮3商家写拿案例截图","朋友圈/本地群发案例接单","定套餐¥200/篇或¥800/月5篇","每月更新模板保持竞争力"],sop:"Day1研究爆款笔记+AI生成5模板·Day3免费帮2商家写拿到案例·Day7接单收到第一笔¥200",tools:"小红书App·豆包/Kimi写文案·醒图配图·微信收款",pitfall:"坑：承诺效果被追责→只承诺'专业文案+关键词优化'不承诺流量"},
  {title:"用AI做简历优化月入5千",device:"手机",idea:"每年千万求职者，90%简历不过关。用手机AI优化简历，30分钟一单¥50-100。纯手机、永续需求、可复制。核心是挖掘亮点+JD关键词匹配。",target:"应届生/转行者/1-5年职场人",cost:"1天+¥0",revenue:"保守¥2,500/月·50单 | 乐观¥5,000/月·100单 | 爆发¥10,000/月·增值服务",difficulty:"低·懂简历结构+AI提示词",actions:["AI分析50份优秀简历总结模板","设计3档¥50/¥80/¥100","闲鱼/小红书发布服务","每单30分钟AI生成+人工润色","收集好评截图循环推广"],sop:"Day1用AI生成5套简历模板+研究JD关键词·Day3免费优化3份简历拿案例·Day7闲鱼上架收到5单",tools:"豆包/Kimi·闲鱼接单·微信沟通·WPS手机版导出",pitfall:"坑：AI写得太假→每份简历基于客户真实经历改写40%以上"},
  {title:"手机做短视频剪辑月入6千",device:"手机",idea:"个人IP和小商家需要短视频但不会剪。用手机剪映帮他们剪15-60秒视频按条收费。零成本、30分钟一条、需求爆发式增长。",target:"想做短视频但不会剪辑的个人IP/小商家/知识博主",cost:"1天+¥0",revenue:"保守¥3,000/月·30条 | 乐观¥6,000/月·60条 | 爆发¥12,000/月·包月",difficulty:"低·会用剪映即可",actions:["1天学会剪映基础+调色+转场","制作3种风格样片口播/混剪/卡点","抖音/闲鱼发布剪辑接单","定价¥100/条或¥600/月8条","建模板库提速到20分钟/条"],sop:"Day1学会剪映+做3样片·Day3免费帮2人剪辑拿好评·Day7接单收到第一笔¥100",tools:"剪映App免费·CapCut·醒图做封面·微信收款",pitfall:"坑：量太大质量下降→每天限5单；客户素材差→接单前明确素材标准"},
  {title:"闲鱼卖AI虚拟产品月入4千",device:"手机",idea:"在闲鱼卖AI生成的虚拟产品：PPT模板、简历模板、合同模板、学习笔记。一次制作无限复售。零成本、闲鱼流量免费、24小时自动发货。",target:"不想花时间做模板的职场人/学生/创业者",cost:"1天+¥0",revenue:"保守¥2,000/月 | 乐观¥4,000/月 | 爆发¥8,000/月",difficulty:"低·会用AI+闲鱼上架",actions:["AI生成50套PPT/简历/合同模板","闲鱼上架定价¥9.9-29.9/套","标题优化含'2026最新''HR推荐'等关键词","打包卖¥49.9终身会员提升客单价","每天花30分钟回复消息维护"],sop:"Day1用AI生成50套模板+上架10商品·Day3优化标题+上架30商品·Day7出第1单+持续上架新品",tools:"豆包/Kimi生成模板·闲鱼App·百度网盘交付·微信收款",pitfall:"坑：模板质量差被差评→每个上架前自己审核一遍；同质化严重→每个模板加独特点评/使用说明"},
  {title:"手机做朋友圈文案代写月入3千",device:"手机",idea:"微商/保险/房产中介每天发朋友圈但不会写。用AI帮写¥5-10/条，30秒一条。纯手机、极高复购率、零成本。客户一旦用上就离不开。",target:"需要维护朋友圈人设的微商/保险经纪人/房产中介",cost:"1天+¥0",revenue:"保守¥1,500/月 | 乐观¥3,000/月 | 爆发¥6,000/月·包月",difficulty:"低·会用手机打字即可",actions:["AI生成3类文案模板产品/生活/干货","在微信/行业群发广告接单","定价¥5/条或¥100/月30条","做一个朋友圈案例号展示效果","推包月套餐增加客户粘性"],sop:"Day1用AI生成20条不同风格文案+建案例号·Day3行业群发广告+免费帮3人写·Day7收到第一个包月客户¥100",tools:"微信接单沟通收款·豆包/Kimi写文案",pitfall:"坑：AI文案冷冰冰→每条加一句个性化内容；客户觉得贵→展示同行请人写朋友圈月薪¥3000+"},
  {title:"手机做口播视频代剪月入5千",device:"手机",idea:"知识博主每天录口播但不会剪辑加字幕。用手机剪映帮他们加字幕/BGM/封面，¥50-80/条。需求爆发（每个知识博主每天至少1条），纯手机操作。",target:"每天发口播视频的知识博主/教育博主/律师",cost:"1天+¥0",revenue:"保守¥2,500/月·50条 | 乐观¥5,000/月·100条 | 爆发¥8,000/月·包月",difficulty:"低·剪映自动字幕+基础剪辑",actions:["学剪映自动字幕+BGM+封面模板","做3个口播剪辑样片对外展示","在抖音/小红书找知识博主私信接单","定价¥50/条或¥500/月12条","建常用BGM库+封面模板提效"],sop:"Day1学会剪映自动字幕+做3样片·Day3私信20个知识博主+免费帮2人剪·Day7接到第一个包月客户¥500",tools:"剪映App自动字幕免费·醒图做封面·抖音/小红书找客户·微信收款",pitfall:"坑：字幕错误被客户投诉→剪完自己看一遍再交付；博主不给素材→提前要百度网盘链接"},
  {title:"手机帮人代运营小红书月入6千",device:"手机",idea:"小商家想做小红书但不会运营。你帮他们写笔记+做图+定时发布，¥500-1000/月/号。纯手机、需求巨大、客户粘性极高。一个人可同时管5-8个号。",target:"想拓客但不会运营小红书的美容/餐饮/健身/民宿商家",cost:"1天+¥0",revenue:"保守¥3,000/月·5号 | 乐观¥6,000/月·8号 | 爆发¥10,000/月·10号+",difficulty:"低·会用小红书+AI+醒图",actions:["研究小红书爆款笔记规律建立模板库","AI生成笔记文案+醒图做封面内页","找3个商家免费代运营1周拿案例","定套餐¥500基础/¥1000高级含数据分析","用定时发布功能批量排期省时间"],sop:"Day1建3套行业笔记模板+学基础数据分析·Day3免费帮2商家运营1周拿数据案例·Day7朋友圈/本地群推广接到第一单¥500",tools:"小红书App·豆包/Kimi写笔记·醒图做图·微信沟通·小红书定时发布功能",pitfall:"坑：商家期望1个月涨粉1万→提前设合理预期说清楚需要2-3个月；号被封→严格遵守平台规则不买量不刷量"},
  {title:"手机卖AI绘画定制头像月入3千",device:"手机",idea:"用Midjourney/手机AI绘画工具帮人定制情侣头像/宠物头像/全家福漫画，¥30-80/张。零成本、纯手机、社交传播强，客户会主动帮你发朋友圈。",target:"想定制个性化头像的年轻人/情侣/宝妈",cost:"1天+¥0（AI绘画工具免费额度）",revenue:"保守¥1,500/月·50张 | 乐观¥3,000/月·100张 | 爆发¥6,000/月·婚庆批量",difficulty:"低·会用手机AI绘画App+会写prompt",actions:["学会手机AI绘画工具写prompt","做20个不同风格样片发小红书展示","闲鱼/小红书接单定价¥30-80/张","建风格库：情侣/宠物/全家福/职场","推客户发朋友圈晒图给优惠券"],sop:"Day1学会AI绘画+做20样片发小红书·Day3闲鱼上架+接前3单免费练手·Day7收到第一笔付费¥30+客户主动发朋友圈",tools:"手机AI绘画工具·小红书展示·闲鱼接单·微信收款·Canva加文字",pitfall:"坑：AI生成的脸不像客户→多试几次prompt+人工微调；交付慢→限定每天最多10张"},
  {title:"手机做情感树洞陪聊月入3千",device:"手机",idea:"现代人孤独感强，需要倾诉但不找心理咨询。用AI辅助在手机做情感陪聊/树洞倾听，¥30-50/小时。零成本、纯手机、需求巨大。AI帮你快速理解对方情绪给回应建议。",target:"感到孤独想找人说话的年轻人/异地恋情侣/工作压力大的白领",cost:"1天+¥0",revenue:"保守¥1,500/月·50小时 | 乐观¥3,000/月·100小时 | 爆发¥6,000/月·包月客户",difficulty:"低·会倾听+AI辅助共情",actions:["学基础倾听技巧+AI情绪识别提示词","在Soul/探探/闲鱼发布陪聊服务","定价¥30/半小时或¥300/月不限时","AI实时辅助提供共情回应建议","建客户信任后推长期包月"],sop:"Day1学倾听技巧+AI情绪提示词+注册Soul·Day3开始接单前3单免费练手·Day7接到第一个付费客户¥30",tools:"手机Soul/探探获客·豆包/Kimi实时情绪分析·微信收款",pitfall:"坑：被当成心理咨询师追责→明确说'树洞倾听不是心理咨询'；遇到骚扰→果断拉黑不纠结"},
  {title:"手机做优惠券分享赚佣金月入2千",device:"手机",idea:"在微信群/朋友圈分享外卖/电商/打车优惠券，别人用了你赚佣金。零成本、纯手机、完全自动化。一个人管5-10个群每月被动收入¥1000-3000。",target:"想省钱点外卖/网购/打车的普通消费者",cost:"1天+¥0",revenue:"保守¥1,000/月 | 乐观¥2,000/月 | 爆发¥5,000/月·扩大群规模",difficulty:"低·会用手机分享链接即可",actions:["注册淘宝联盟/美团联盟/滴滴推广","建3个本地生活优惠群拉人","每天定时分享3-5条精选优惠","用AI写吸引人点击的推荐文案","裂变：让群友邀请好友给红包"],sop:"Day1注册3个联盟账号+建第一个群50人·Day3每天定时分享优惠+群增加到100人·Day7佣金日入¥30+裂变到200人",tools:"淘宝联盟App·美团联盟·滴滴推广·微信群·豆包写推荐文案",pitfall:"坑：群变成广告垃圾群→制定群规严禁其他人发广告；佣金太少想放弃→坚持1个月群规模起来后被动收入翻倍"},
  // 电脑端 10 条
  {title:"3天搭建AI客服系统月入2万",device:"电脑",idea:"本地商户每天重复回答相同问题，无力自建AI。用Dify拖拽搭建知识库SaaS集成到商户公众号按年收费。需求极刚、技术门槛低到只需基础Python、3天出MVP。",target:"有公众号的本地商户口腔/律所/教培日均咨询>20条",cost:"3天+¥1200 API¥500+服务器¥200/月+域名¥100",revenue:"保守¥3000/月·5客户 | 乐观¥8000/月·15客户 | 爆发¥20000/月·30客户",difficulty:"低·基础Python拖拽搭建无需ML",actions:["整理口腔/律所100个高频FAQ","用Dify搭建知识库+接入测试公众号","做3页演示文档含真实截图","联系5家商户提供7天免费试用","推出¥600/年正式套餐开始收费"],sop:"Day1注册Dify+整理50条FAQ·Day3搭建原型+自测准确率≥80%·Day7联系商户试用≥2家有意向",tools:"Dify.ai·微信公众号·阿里云轻量服务器¥200/月",pitfall:"坑：一次做5个行业都不精→先深耕1个再扩展；商户不信AI→前7天每条回复人工审核积累信任"},
  {title:"帮小企业AI建站月入1.5万",device:"电脑",idea:"线下小公司每年被建站公司收¥5000+。你用AI+WordPress 3天交付基础官网收¥800-1500。每个城市上万小企业、WordPress拖拽零代码、AI写文案配图加速10倍。",target:"年营收50-300万无官网或官网老旧的装修/家政/工厂",cost:"2天+¥300域名¥50+服务器¥150+Elementor¥100",revenue:"保守¥4000/月·5客户 | 乐观¥7500/月·10客户 | 爆发¥15000/月·20客户+维护费",difficulty:"低·WordPress拖拽建站无需编程",actions:["准备3套行业网站模板装修/家政/工厂","58同城/本地论坛发布建站服务","AI生成客户行业文案+图片建议","3天标准化交付流程规范","推维护套餐¥200/月增加复购"],sop:"Day1准备3套模板+注册域名服务器·Day3找到第一个付费客户交付初版·Day7完成3客户+本地论坛获好评",tools:"WordPress·Elementor拖拽建站·Hostinger服务器·Canva设计·AI写文案",pitfall:"坑：客户反复改需求拖工期→合同约定免费修改2次超出另收费；网站速度慢→选好服务器+图片压缩+缓存插件"},
  {title:"微信小商店代运营月入8千",device:"电脑",idea:"小商家想做微信私域但不会搭建小商店。你帮搭建+配置商品+设计裂变活动按月收费。微信12亿用户、小商店免费开通、商家只需要人帮他执行。",target:"有实体店想做微信私域但不懂技术的本地餐饮/服装/美业商家",cost:"2天+¥500企微助手¥200+裂变工具¥300",revenue:"保守¥4000/月·5客户 | 乐观¥8000/月·10客户 | 爆发¥15000/月·加活动策划",difficulty:"低·微信后台操作+基础设计",actions:["1天学会微信小商店全部功能","免费帮第一个客户搭建拿案例","设计套餐基础¥800/月+高级¥1500/月","AI生成朋友圈文案和促销方案","本地商家群/豆瓣同城发布服务"],sop:"Day1学会小商店功能+搭建案例店·Day3免费帮1商家搭建配置10商品·Day7本地群推广收到第一笔¥800",tools:"微信小商店后台免费·Canva/稿定设计做海报·有赞/微盟进阶工具·企业微信",pitfall:"坑：商家期望开了店就爆单→提前明确只负责搭建和基本运营不保证效果；商家不会配合→准备好AI生成的商品文案和图片"},
  {title:"用AI批量做SEO文章代写月入1万",device:"电脑",idea:"中小企业想做SEO但写不出文章。你用AI批量生成行业SEO文章¥200-500/篇。每个公司每月需要10+篇文章、AI时代成本几乎为零、客户按月续费粘性极高。",target:"有官网但没流量想做SEO的中小企业老板/运营",cost:"2天+¥500 SEMrush¥300+AI API¥200",revenue:"保守¥4000/月·20篇 | 乐观¥10000/月·40篇 | 爆发¥20000/月·包月客户",difficulty:"中·需了解基础SEO关键词研究+文章结构",actions:["学SEO基础关键词研究+文章结构","AI生成5篇不同行业范文作案例","Upwork/淘宝/猪八戒接单","定价¥200/篇基础¥500/篇含关键词研究","推包月¥2000/月10篇锁客户"],sop:"Day1学SEO基础+AI生成3篇范文·Day3注册Upwork+提交5个Proposal·Day7接到第一单¥200+交付",tools:"SEMrush/Ahrefs关键词工具·ChatGPT/Claude写文章·WordPress发布·Grammarly检查",pitfall:"坑：AI文章被Google判垃圾→每篇必加人工编辑+原创案例+真实数据；客户不续费→前3篇超预期交付建立信任"},
  {title:"搭建AI工具导航站靠广告月入5千",device:"电脑",idea:"AI工具爆发式增长用户不知道用哪个。你搭建AI工具导航站收录+分类+点评，靠AdSense和Affiliate赚美金。一次搭建、持续更新、流量滚雪球越滚越大。",target:"想找AI工具但不知道用哪个的职场人/创业者/学生",cost:"3天+¥300域名¥50+服务器¥150+主题¥100",revenue:"保守¥2000/月 | 乐观¥5000/月 | 爆发¥15000/月·流量爆发",difficulty:"低·WordPress搭站+日常更新",actions:["买域名+WordPress+导航主题搭建","手动收录100个AI工具+写短点评","提交Google收录+各导航站交换友链","挂AdSense广告+Affiliate链接","每天更新5个新工具保持活跃"],sop:"Day1买域名服务器+装WordPress+导航主题·Day3收录100工具+写点评+上线·Day7提交Google+交换5友链+开始有自然流量",tools:"WordPress·导航站主题ThemeForest·Google AdSense·Affiliate平台·Google Analytics",pitfall:"坑：收录太少没人来→前7天每天至少加20个；没特色只抄别人→每个工具加一句真实使用点评"},
  {title:"做Notion模板生意月入5千",device:"电脑",idea:"越来越多人用Notion管理生活和工作但不会设计模板。你设计Notion模板卖¥5-30/个。一次设计无限销售、Notion官方Gallery给免费流量、模板需求爆发式增长。",target:"用Notion但不会设计模板的职场人/学生/自由职业者",cost:"2天+¥0 Notion免费",revenue:"保守¥2000/月 | 乐观¥5000/月 | 爆发¥10000/月·爆款模板",difficulty:"低·会用Notion+懂用户需求",actions:["研究Notion官方Gallery爆款模板规律","设计5个模板：周计划/读书笔记/项目管理/OKR/记账","Notion官方Gallery上架+Gumroad售卖","定价¥5-30/个或打包¥99终身","在小红书/Twitter展示模板截图引流"],sop:"Day1研究Gallery爆款+设计第一个模板·Day3完成5模板+上架Gallery+Gumroad·Day7小红书发模板展示笔记开始出单",tools:"Notion免费·Gumroad售卖·Canva做封面图·小红书/Twitter推广",pitfall:"坑：模板复杂没人会用→每个模板附5分钟教程视频；同质化→每个模板加独特色彩/排版风格"},
  {title:"做独立站Dropshipping月入8千",device:"电脑",idea:"用Shopify+速卖通做Dropshipping：找到热门产品→建独立站→投FB广告→供应商直发。无需囤货、全球市场、AI帮你写产品描述优化广告。找准一个品就能月入过万。",target:"海外消费者（美国/欧洲为主）",cost:"3天+¥2000 Shopify月费¥200+广告测试¥1000+域名¥100",revenue:"保守¥3000/月 | 乐观¥8000/月 | 爆发¥20000/月·爆品",difficulty:"中·需理解选品逻辑+基础广告投放",actions:["用广告spy工具找近期爆品","Shopify建站+AI写产品页文案","FB/INS广告测试¥100/天小预算","找到ROI>2的广告组加预算","稳定后加TikTok广告渠道扩大"],sop:"Day1用spy工具找到3个潜力品+建Shopify站·Day3上线产品页+开FB广告测试·Day7优化广告出5单以上+加预算",tools:"Shopify建站·速卖通/Aliexpress找货源·Facebook Ads·Canva做广告素材·AI写产品描述",pitfall:"坑：选品失败广告费打水漂→每品¥200封顶测试预算超了就止损；物流慢被投诉→选ePacket/USPS直发并提前说明物流时间"},
  {title:"开发Chrome插件卖订阅月入1万",device:"电脑",idea:"发现日常工作流中的痛点→开发Chrome插件→Chrome Web Store上架→Freemium模式收订阅费。一次开发、持续收入、Chrome商店自带流量。AI帮你写代码加速10倍。",target:"有特定工作流痛点的职场人/开发者/设计师",cost:"5天+¥500 Chrome开发者注册¥25+服务器¥200/月+AI工具¥200",revenue:"保守¥3000/月·100付费用户 | 乐观¥10000/月·300付费用户 | 爆发¥30000/月·爆款插件",difficulty:"中·需基础JS+HTML+CSS（AI可写90%代码）",actions:["调研Chrome商店找到低竞争高需求方向","AI辅助写插件代码+本地测试","设计Freemium策略免费基础功能+高级付费","Chrome商店上架+优化关键词标题","Product Hunt/Reddit发帖获取种子用户"],sop:"Day1确定插件方向+AI生成第一个版本代码·Day3本地测试通过+Chrome商店提交审核·Day7审核通过+Product Hunt发帖+前50个用户",tools:"Chrome Developer Dashboard·Cursor/Copilot写代码·Product Hunt推广·Stripe收订阅费",pitfall:"坑：方向太泛没人用→聚焦一个超具体痛点如'一键导出网页所有图片'；审核被拒→严格读Chrome政策不用远程代码"},
  {title:"帮人做AI工作流自动化月入1万",device:"电脑",idea:"中小企业大量重复工作可自动化但不知道怎么做。你用Zapier/Make+AI帮他们搭建自动化工作流，¥2000-5000/项目。需求巨大、客单价高、复购强。",target:"有重复工作流程但不懂技术的中小企业老板/运营经理",cost:"3天+¥500 Zapier月费¥200+Make免费+AI API¥300",revenue:"保守¥4000/月·2项目 | 乐观¥10000/月·4项目 | 爆发¥20000/月·维护费",difficulty:"中·需理解Zapier/Make逻辑+会AI提示词",actions:["学Zapier/Make基础自动化逻辑","找3个常见场景建模板：邮件自动回复/数据汇总/报表生成","在Upwork/淘宝/LinkedIn发布服务","免费帮1个客户做自动化拿案例","推维护套餐¥500/月保证正常运行"],sop:"Day1学会Zapier/Make+搭建第一个自动化模板·Day3免费帮1客户做自动化拿案例·Day7LinkedIn/Upwork推广接到第一单¥2000",tools:"Zapier/Make自动化平台·ChatGPT/Claude辅助·Google Sheets·Slack/飞书集成",pitfall:"坑：客户需求不清晰反复改→签合同前用流程图确认每一步；自动化断了客户急→建监控+每周检查一次的维护套餐"},
  {title:"做B2B邮件营销代运营月入7千",device:"电脑",idea:"外贸工厂/跨境电商需要找海外客户但不会写英文开发信。你用AI批量生成个性化开发信+邮件自动化发送，¥2000-5000/月/客户。需求巨大、AI翻译+个性化让回复率翻倍。",target:"想做海外市场但不会写英文开发信的外贸工厂/跨境电商",cost:"2天+¥800邮件工具¥300+邮箱服务¥200+AI API¥300",revenue:"保守¥4000/月·2客户 | 乐观¥7000/月·4客户 | 爆发¥15000/月·大客户",difficulty:"中·需基础英文+邮件营销逻辑",actions:["学邮件营销基础打开率/回复率优化","AI写10套不同行业英文开发信模板","用Mailchimp/SendGrid做自动化发送","找外贸工厂免费帮发一周拿数据案例","定套餐¥2000/月含500封个性化邮件"],sop:"Day1学邮件营销+AI生成10套模板·Day3搭建Mailchimp自动化流程+免费帮1客户发·Day7发外贸社群广告接到第一单¥2000",tools:"Mailchimp/SendGrid发邮件·ChatGPT写英文开发信·Hunter找客户邮箱·Google Sheets管理",pitfall:"坑：邮件进垃圾箱→设置SPF/DKIM+控制每日发送量不超过100封；客户觉得贵→展示开发信回复率从1%提升到5%的数据"}
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tier = searchParams.get('tier') || 'free';
  const limit = tier === 'paid' ? 10 : 1;

  let allOpps = [];

  // 1. 尝试从爬虫+AI获取新鲜机会
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const crawlerRes = await fetch(`${baseUrl}/api/crawler`, { cache: 'no-store' });
    if (crawlerRes.ok) {
      const { data } = await crawlerRes.json();
      const seen = new Set();
      data.forEach((src) => {
        src.opportunities.forEach((opp) => {
          const key = opp.title?.slice(0, 8);
          if (!seen.has(key)) {
            seen.add(key);
            if (!opp.device) opp.device = '电脑';
            allOpps.push(opp);
          }
        });
      });
    }
  } catch (e) {
    console.error('爬虫失败，使用精选池:', e.message);
  }

  // 2. AI不够，精选池补充（每天随机打乱保证新鲜度）
  if (allOpps.length < limit) {
    const needed = limit - allOpps.length;
    const existing = new Set(allOpps.map(o => o.title?.slice(0, 8)));
    const fresh = POOL.filter(o => !existing.has(o.title.slice(0, 8)));
    const shuffled = fresh.sort(() => Math.random() - 0.5);
    allOpps.push(...shuffled.slice(0, needed));
  }

  // 3. 付费版强制 5电脑 + 5手机 平衡
  let result = allOpps.slice(0, limit);
  
  if (tier === 'paid') {
    const pcPool = POOL.filter(o => o.device === '电脑');
    const phonePool = POOL.filter(o => o.device === '手机');
    
    const pcFromResult = result.filter(o => o.device === '电脑');
    const phoneFromResult = result.filter(o => o.device === '手机');
    
    const finalPC = pcFromResult.slice(0, 5);
    const finalPhone = phoneFromResult.slice(0, 5);
    
    const existingTitles = new Set([...finalPC, ...finalPhone].map(o => o.title?.slice(0, 8)));
    
    while (finalPC.length < 5) {
      const next = pcPool.find(o => !existingTitles.has(o.title.slice(0, 8)));
      if (!next) break;
      existingTitles.add(next.title.slice(0, 8));
      finalPC.push(next);
    }
    while (finalPhone.length < 5) {
      const next = phonePool.find(o => !existingTitles.has(o.title.slice(0, 8)));
      if (!next) break;
      existingTitles.add(next.title.slice(0, 8));
      finalPhone.push(next);
    }
    
    result = [...finalPC.slice(0, 5), ...finalPhone.slice(0, 5)];
  }

  return NextResponse.json({
    success: true,
    report: {
      timestamp: new Date().toISOString(),
      opportunities: result,
      source: allOpps.length > 20 ? 'ai_generated' : 'curated_pool'
    },
    total: result.length
  }, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

export async function POST() {
  return GET();
}
