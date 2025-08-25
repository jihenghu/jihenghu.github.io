document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;
  const threshold = 100; // 阈值，滚动超过 100px 才触发

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // 判断是否超过阈值
    if (Math.abs(scrollTop - lastScrollTop) > threshold) {
      if (scrollTop > lastScrollTop) {
        // 向下滚动 -> 隐藏
        navbar.classList.add('hide');
      } else {
        // 向上滚动 -> 显示
        navbar.classList.remove('hide');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // 避免负数
    }
  });
});
