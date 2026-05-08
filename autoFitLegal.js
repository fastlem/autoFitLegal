/**
 * autoFitLegal.js – автоматическое масштабирование текста в блоках с дисклеймерами
 * 
 * Copyright (c) 2024-2026 https://www.banners728.ru, https://www.you-digital.ru You Digital Inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 * 
 * Использование:
 * 
 * 1. Автоматический запуск. Подключите скрипт, он найдёт элементы .title_legal и будет работать без вызова init().
 * 
 * 2. Ручной запуск с кастомными настройками
 *      AutoFitLegal.init({
 *          selector: '.my-disclaimer',     // CSS селектор блоков (по умолчанию '.title_legal')
 *          minFontSize: 2,                 // минимальный шрифт в px
 *          maxFontSize: 150,               // максимальный шрифт в px
 *          tolerance: 2,                   // допустимый запас в px (для округлений)
 *          defaultLineHeight: 1.3          // стандартный line-height для подбора
 *      });
 * 
 * 3. Принудительно пересчитать все блоки после динамических изменений
 *      AutoFitLegal.run();                 // перезапустит подбор шрифта для всех найденных элементов
 * 
 * 4. Если нужно обновить настройки и пересчитать
 * 
 *      const instance = AutoFitLegal.init({ selector: '.legal' });
 *      // потом, например, сменили селектор:
 *      instance.update({ selector: '.footer-legal', minFontSize: 3 });
 * 
 *  
**/

(function(g){
    let inst=null;
    const D={selector:'.title_legal',minFontSize:1,maxFontSize:200,tolerance:1,lineHeightStep:.05,minLineHeight:1,defaultLineHeight:1.2};
    function fit(e,o){
        if(!e||!e.innerText)return;
        e.style.overflow='hidden';e.style.boxSizing='border-box';e.style.wordBreak='break-word';e.style.whiteSpace='normal';
        e.style.padding='0';e.style.margin='0';e.style.fontSize='';e.style.lineHeight='';
        let max=Math.min(o.maxFontSize,e.clientHeight,e.clientWidth/1.5);
        if(max<o.minFontSize)max=o.minFontSize;
        const ck=(fs,lh)=>(e.style.fontSize=fs+'px',e.style.lineHeight=lh,void e.offsetHeight,e.scrollHeight<=e.clientHeight+o.tolerance&&e.scrollWidth<=e.clientWidth+o.tolerance);
        let best=o.minFontSize,bestLH=o.defaultLineHeight;
        for(let lo=o.minFontSize,hi=max;lo<=hi;){const mid=(lo+hi)>>1;if(ck(mid,o.defaultLineHeight)){best=mid;bestLH=o.defaultLineHeight;lo=mid+1;}else hi=mid-1;}
        if(!ck(best,bestLH)&&best===o.minFontSize)for(let lh=o.defaultLineHeight;lh>=o.minLineHeight;lh-=o.lineHeightStep)if(ck(o.minFontSize,lh)){best=o.minFontSize;bestLH=lh;break;}
        e.style.fontSize=best+'px';e.style.lineHeight=bestLH;
        if(!ck(best,bestLH)&&best>o.minFontSize)e.style.fontSize=(best-1)+'px';
    }
    function run(o){document.querySelectorAll(o.selector).forEach(e=>fit(e,o));}
    function init(opts){
        const cfg=Object.assign({},D,opts);
        const exec=()=>run(cfg);
        if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',exec);
        else exec();
        let to;window.addEventListener('resize',()=>{clearTimeout(to);to=setTimeout(exec,100);});
        const mob=new MutationObserver(exec);document.querySelectorAll(cfg.selector).forEach(el=>mob.observe(el,{childList:1,subtree:1,characterData:1}));
        if(window.ResizeObserver){const ro=new ResizeObserver(exec);document.querySelectorAll(cfg.selector).forEach(el=>ro.observe(el));}
        return {run:()=>exec(),update:(newOpts)=>{Object.assign(cfg,newOpts);exec();}};
    }
    g.AutoFitLegal={init:init,run:function(){if(inst)inst.run();else console.warn('AutoFitLegal: сначала вызовите .init()');}};
    if(document.querySelector(D.selector))setTimeout(()=>{if(!inst){inst=g.AutoFitLegal.init();}},0);
})(window);