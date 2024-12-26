'use client';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* 整体跳动的文字 */}
      <div className="animate-bounce-medium text-[50px] font-normal tracking-widest">
        资讯准备中
      </div>
    </div>
  );
};

export default LoadingSpinner;
