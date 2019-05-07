;(function() {

    'use strict';

    $('.to-reg-btn').on('click', () => {
        $('.pop-up').removeClass('pop-up--active');
        $('.sign-up-form').addClass('pop-up--active');
    });

    $('.to-login-btn').on('click', () => {
        $('.pop-up').removeClass('pop-up--active');
        $('.sign-in-form').addClass('pop-up--active');
    });

    $('.to-reg-active').on('click', () => {
        $('.pop-up').removeClass('pop-up--active');
        $('.sign-up-active').addClass('pop-up--active');
    });
    
})();