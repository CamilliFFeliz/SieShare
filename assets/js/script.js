$(document).ready(function() {
    $(document).on('click', '.siebot_hub-card', function (e) {
        e.preventDefault();
        
        const href = $(this).data('href');
        
        if (href) {
            // Efeito visual de clique
            $(this).css('transform', 'scale(0.98)');
            
            // Redirecionamento após pequeno delay para dar tempo de ver a animação
            setTimeout(() => {
                window.location = href;
            }, 150);
        }
    });
});