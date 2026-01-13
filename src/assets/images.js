// 导入所有图片资源
const images = import.meta.glob('./images/**/*.{png,jpg,jpeg,gif,svg}', { eager: true, as: 'url' });

// 导出图片路径映射
export default images;