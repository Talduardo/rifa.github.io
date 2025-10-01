// ---------------------- Carrossel ----------------------
(function() {
    const imgs = document.querySelectorAll('.carrossel .premio-img');
    const prevBtn = document.querySelector('.carrossel-btn.prev');
    const nextBtn = document.querySelector('.carrossel-btn.next');
    const contador = document.getElementById('premioContador');
    let idx = 0;
    let timer = null;

    function showImg(i) {
        imgs.forEach((img, j) => img.classList.toggle('active', j === i));
        if (contador) contador.textContent = `${i + 1}/${imgs.length}`;
    }
    function nextImg() {
        idx = (idx + 1) % imgs.length;
        showImg(idx);
    }
    function prevImg() {
        idx = (idx - 1 + imgs.length) % imgs.length;
        showImg(idx);
    }
    function startAuto() {
        clearInterval(timer);
        timer = setInterval(nextImg, 3000);
    }
    if (imgs.length) {
        showImg(idx);
        startAuto();
        if (prevBtn) prevBtn.addEventListener('click', () => { prevImg(); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { nextImg(); startAuto(); });
    }
})();

// ---------------------- Sidebar ----------------------
(function() {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-list a');
    if (menuBtn && sidebar && closeSidebar && sidebarOverlay) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('open');
        });
        [closeSidebar, sidebarOverlay].forEach(el => el.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('open');
        }));
        // Navegação suave e fechamento ao clicar em link
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('open');
            });
        });
    }
    // Abrir modal de login/cadastro ao clicar em "Entrar" do menu lateral
    const menuEntrar = document.getElementById('menuEntrar');
    if (menuEntrar) {
        menuEntrar.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.openAuthModal) window.openAuthModal();
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('open');
        });
    }
})();

// ---------------------- Promoção: Seleção de Quantidade ----------------------
(function() {
    const promoBtns = document.querySelectorAll('.promocao-btn');
    const quantInput = document.getElementById('quantInput');
    const btnMinus = document.getElementById('btnMinus');
    const btnPlus = document.getElementById('btnPlus');
    const valorParticipar = document.getElementById('valorParticipar');
    const valorParticiparMobile = document.getElementById('valorParticiparMobile');
    const VALOR_UNITARIO = 0.29;

    function atualizarValor() {
        let qtd = parseInt(quantInput.value, 10) || 1;
        qtd = Math.max(qtd, 1);
        quantInput.value = qtd;
        const valor = "R$ " + (qtd * VALOR_UNITARIO).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        if (valorParticipar) valorParticipar.textContent = valor;
        if (valorParticiparMobile) valorParticiparMobile.textContent = valor;
    }

    promoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            promoBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            quantInput.value = btn.dataset.quant;
            atualizarValor();
        });
    });

    if (btnMinus) btnMinus.addEventListener('click', () => {
        let val = parseInt(quantInput.value, 10) || 1;
        quantInput.value = Math.max(val - 1, 1);
        atualizarValor();
    });
    if (btnPlus) btnPlus.addEventListener('click', () => {
        let val = parseInt(quantInput.value, 10) || 1;
        quantInput.value = val + 1;
        atualizarValor();
    });
    if (quantInput) quantInput.addEventListener('input', atualizarValor);

    atualizarValor();
})();

// ---------------------- Autenticação e Usuário ----------------------
(function() {
    const openLogin = document.getElementById('openLogin');
    const modalBg = document.getElementById('modalBg');
    const modalAuth = document.getElementById('modalAuth');
    const closeModalAuth = document.getElementById('closeModalAuth');
    const toggleAuth = document.getElementById('toggleAuth');
    const authForm = document.getElementById('authForm');
    const userInfo = document.getElementById('userInfo');
    const userEmail = document.getElementById('userEmail');
    const logoutBtn = document.getElementById('logoutBtn');
    let isLogin = true;
    let pendingCompra = false;

    function isUserLogged() {
        return !!localStorage.getItem('userEmail');
    }
    function showUser() {
        if (isUserLogged()) {
            if (openLogin) openLogin.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
            if (userEmail) userEmail.textContent = localStorage.getItem('userEmail');
        } else {
            if (openLogin) openLogin.style.display = '';
            if (userInfo) userInfo.style.display = 'none';
            if (userEmail) userEmail.textContent = '';
        }
    }
    showUser();

    function openAuthModal() {
        if (modalBg) modalBg.style.display = 'block';
        if (modalAuth) modalAuth.style.display = 'block';
        document.body.style.overflow = 'hidden';
        isLogin = true;
        const modalAuthTitle = document.getElementById('modalAuthTitle');
        if (modalAuthTitle) modalAuthTitle.textContent = 'Entrar';
        if (authForm) authForm.querySelector('button').textContent = 'Entrar';
        if (toggleAuth) toggleAuth.innerHTML = 'Não tem conta? <span style=\"color:#ffe600;\">Cadastre-se</span>';
    }
    function closeAuthModal() {
        if (modalBg) modalBg.style.display = 'none';
        if (modalAuth) modalAuth.style.display = 'none';
        document.body.style.overflow = '';
        if (pendingCompra && isUserLogged()) {
            pendingCompra = false;
            setTimeout(window.abrirCompra, 300);
        }
    }
    if (openLogin) openLogin.addEventListener('click', openAuthModal);
    if (closeModalAuth) closeModalAuth.addEventListener('click', closeAuthModal);
    if (modalBg) modalBg.addEventListener('click', closeAuthModal);

    if (toggleAuth) toggleAuth.addEventListener('click', () => {
        isLogin = !isLogin;
        const modalAuthTitle = document.getElementById('modalAuthTitle');
        if (modalAuthTitle) modalAuthTitle.textContent = isLogin ? 'Entrar' : 'Cadastrar';
        if (authForm) authForm.querySelector('button').textContent = isLogin ? 'Entrar' : 'Cadastrar';
        toggleAuth.innerHTML = isLogin
            ? 'Não tem conta? <span style=\"color:#ffe600;\">Cadastre-se</span>'
            : 'Já tem conta? <span style=\"color:#ffe600;\">Entrar</span>';
    });

    if (authForm) authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const senha = document.getElementById('authPassword').value;
        if (!email || !senha) return;
        localStorage.setItem('userEmail', email);
        closeAuthModal();
        showUser();
        alert(isLogin ? "Login realizado!" : "Cadastro realizado!");
    });

    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('userEmail');
        showUser();
    });

    // Expor para compra
    window.isUserLogged = isUserLogged;
    window.showUser = showUser;
    window.openAuthModal = openAuthModal;
})();

// ---------------------- Compra de Pontos ----------------------
(function() {
    const abrirCompraPontos = document.getElementById('abrirCompraPontos');
    const compraPontos = document.getElementById('compraPontos');
    const closeCompraPontos = document.getElementById('closeCompraPontos');
    const compraQtd = document.getElementById('compraQtd');
    const compraValor = document.getElementById('compraValor');
    const formCompra = document.getElementById('formCompra');
    const compraSucesso = document.getElementById('compraSucesso');
    const nomeCompra = document.getElementById('nomeCompra');
    const emailCompra = document.getElementById('emailCompra');
    const quantInput = document.getElementById('quantInput');
    const valorParticipar = document.getElementById('valorParticipar');
    let pendingCompra = false;

    function abrirCompra() {
        if (!window.isUserLogged || !window.isUserLogged()) {
            pendingCompra = true;
            if (window.openAuthModal) window.openAuthModal();
            return;
        }
        const qtd = quantInput ? quantInput.value : 1;
        const valor = valorParticipar ? valorParticipar.textContent : "R$ 0,00";
        if (compraQtd) compraQtd.textContent = qtd;
        if (compraValor) compraValor.textContent = valor;
        if (compraPontos) compraPontos.style.display = 'block';
        const modalBg = document.getElementById('modalBg');
        if (modalBg) modalBg.style.display = 'block';
        document.body.style.overflow = 'hidden';
        if (emailCompra) emailCompra.value = localStorage.getItem('userEmail') || '';
        if (compraSucesso) compraSucesso.style.display = 'none';
        if (formCompra) formCompra.style.display = '';
    }
    if (abrirCompraPontos) abrirCompraPontos.addEventListener('click', abrirCompra);

    function closeCompra() {
        if (compraPontos) compraPontos.style.display = 'none';
        const modalBg = document.getElementById('modalBg');
        if (modalBg) modalBg.style.display = 'none';
        document.body.style.overflow = '';
    }
    if (closeCompraPontos) closeCompraPontos.addEventListener('click', closeCompra);

    if (formCompra) formCompra.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aqui você pode enviar os dados para o backend se desejar
        if (formCompra) formCompra.style.display = 'none';
        if (compraSucesso) compraSucesso.style.display = 'block';
    });

    // Expor para login fluxo
    window.abrirCompra = abrirCompra;
})();

// ---------------------- Botão Fixo Mobile ----------------------
(function() {
    const ctaFixoMobile = document.getElementById('ctaFixoMobile');
    function toggleCtaMobile() {
        if (!ctaFixoMobile) return;
        ctaFixoMobile.style.display = window.innerWidth <= 700 ? 'block' : 'none';
    }
    if (ctaFixoMobile) {
        ctaFixoMobile.addEventListener('click', () => {
            if (window.abrirCompra) window.abrirCompra();
        });
        window.addEventListener('resize', toggleCtaMobile);
        toggleCtaMobile();
    }
})();