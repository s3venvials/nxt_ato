describe('My Login application', () => {
    it('should login with invalid credentials', async () => {
        await browser.url(`https://the-internet.herokuapp.com/login`);

        await $('#username').setValue('test');
        await $('#password').setValue('test!');
        await $('button[type="submit"]').click();

        await expect($('#flash')).toBeExisting();
        await expect($('#flash')).toHaveTextContaining(
            'Your username is invalid!');
    });
});

