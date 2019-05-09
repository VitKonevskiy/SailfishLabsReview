;(function() {

    'use strict';

    $('.account__settings-btn').on('click', (e) => {
        const
            item = $(e.target),
            pos = $(item).offset();

        $(item).addClass('.account__settings-btn--hide');
 
        $('.pop-up-btn')
            .css('transition-delay', '0s')
            .addClass('pop-up-btn--active');            

        $('.pop-up-btn__wrapper').css({
                'top': pos.top - $(window).scrollTop(),
                'left': pos.left,
                'transition': 'width .6s cubic-bezier(0.19, 1, 0.22, 1),height .6s cubic-bezier(0.19, 1, 0.22, 1),border-radius .2s cubic-bezier(0.19, 1, 0.22, 1)'
            });
    });

    $('.pop-up-btn__close').on('click', () => {

        $('.pop-up-btn__wrapper').css({
            'transition': 'width .6s cubic-bezier(0.19, 1, 0.22, 1), height .6s cubic-bezier(0.19, 1, 0.22, 1), border-radius 1s cubic-bezier(0.19, 1, 0.22, 1)'
        });

        $('.pop-up-btn')
            .css('transition-delay', '.4s')
            .removeClass('pop-up-btn--active');

        $(item).removeClass('.account__settings-btn--hide');
    });

})();