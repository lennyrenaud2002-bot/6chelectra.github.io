// SELECTRA CHECKLIST SIMPLIFIÉE - APPLICATION JAVASCRIPT AVEC AXA MULTI-OPTIONS

class SelectraSimplified {
    constructor() {
        // Configuration de base
        this.callStartTime = null;
        this.isCallActive = false;
        this.callTimer = null;
        this.currentTab = 'checklist';
        
        // État de l'application
        this.state = {
            client: {},
            mentions: {},
            axa: {
                status: 'none', // none, proposed, sold
                price: '6.99'
            },
            offset: {
                status: 'none',
                price: '2.99'
            },
            autres: {}
        };
        
        // Historique des ventes
        this.salesHistory = JSON.parse(localStorage.getItem('selectra-simple-history') || '[]');
        
        this.init();
    }
    
    // === INITIALISATION ===
    init() {
        console.log('🚀 Initialisation Selectra Simplifiée...');
        
        this.setupEventListeners();
        this.updateAllCounters();
        this.updateHistoryDisplay();
        this.updateTabBadges();
        this.updateCommercialSummary();
        
        console.log('✅ Selectra Simplifiée initialisée');
    }
    
    // === GESTION DES ÉVÉNEMENTS ===
    setupEventListeners() {
        // Champs client
        const clientFields = document.querySelectorAll('[data-section="client"]');
        clientFields.forEach(field => {
            field.addEventListener('input', () => {
                this.updateClientCounter();
                this.updateValidateButton();
            });
        });
        
        // Checkboxes mentions légales
        const mentionsCheckboxes = document.querySelectorAll('[data-section="mentions"]');
        mentionsCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateMentionsCounter();
                this.updateValidateButton();
            });
        });
        
        // Checkboxes autres services
        const autresCheckboxes = document.querySelectorAll('[data-section="autres"]');
        autresCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateAutresCounter();
                this.updateCommercialSummary();
                this.updateValidateButton();
            });
        });
        
        // Auto-sauvegarde
        setInterval(() => {
            this.saveState();
        }, 30000);
        
        console.log('🎯 Événements configurés');
    }
    
    // === GESTION DES ONGLETS ===
    switchTab(tabName) {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(`tab-${tabName}`).classList.add('active');
        document.getElementById(`tab-${tabName}-content`).classList.add('active');
        
        this.currentTab = tabName;
        
        if (tabName === 'history') {
            this.updateHistoryDisplay();
        }
        
        console.log(`📱 Onglet: ${tabName}`);
    }
    
    // === GESTION AXA ===
    selectAXAOption(element) {
        // Désélectionner les autres options AXA
        document.querySelectorAll('[data-service="axa"]').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Sélectionner la nouvelle option
        element.classList.add('selected');
        this.state.axa.price = element.dataset.price;
        
        console.log(`🛡️ AXA sélectionné: ${this.state.axa.price}€`);
    }
    
    proposeAXA() {
        this.state.axa.status = 'proposed';
        this.updateAXADisplay();
        this.updateCommercialSummary();
        this.updateValidateButton();
        this.showNotification('AXA proposé au client', 'info');
    }
    
    sellAXA() {
        this.state.axa.status = 'sold';
        this.updateAXADisplay();
        this.updateCommercialSummary();
        this.updateValidateButton();
        this.showNotification(`AXA vendu à ${this.state.axa.price}€`, 'success');
    }
    
    resetAXA() {
        this.state.axa.status = 'none';
        this.updateAXADisplay();
        this.updateCommercialSummary();
        this.updateValidateButton();
        this.showNotification('AXA réinitialisé', 'info');
    }
    
    updateAXADisplay() {
        const counter = document.getElementById('axa-counter');
        const statusText = document.querySelector('#axa-status .status-text');
        const priceDisplay = document.getElementById('axa-price-display');
        
        switch(this.state.axa.status) {
            case 'proposed':
                counter.textContent = 'Proposé';
                counter.style.background = '#FEF3C7';
                counter.style.color = '#92400E';
                statusText.textContent = 'Proposé au client';
                priceDisplay.textContent = `${this.state.axa.price}€/mois`;
                break;
                
            case 'sold':
                counter.textContent = 'Vendu ✅';
                counter.style.background = '#D1FAE5';
                counter.style.color = '#065F46';
                statusText.textContent = 'Vendu';
                priceDisplay.textContent = `${this.state.axa.price}€/mois`;
                break;
                
            default:
                counter.textContent = 'Non proposé';
                counter.style.background = '#F8FAFC';
                counter.style.color = '#64748B';
                statusText.textContent = 'Non proposé';
                priceDisplay.textContent = '';
        }
    }
    
    // === GESTION OFFSET ===
    selectOffsetOption(element) {
        document.querySelectorAll('[data-service="offset"]').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        element.classList.add('selected');
        this.state.offset.price = element.dataset.price;
        
        console.log(`🌱 Offset sélectionné: ${this.state.offset.price}€`);
    }
    
    proposeOffset() {
        this.state.offset.status = 'proposed';
        this.updateOffsetDisplay();
        this.updateCommercialSummary();
        this.updateValidateButton();
        this.showNotification('Offset proposé au client', 'info');
    }
    
    sellOffset() {
        this.state.offset.status = 'sold';
        this.updateOffsetDisplay();
        this.updateCommercialSummary();
        this.updateValidateButton();
        this.showNotification(`Offset vendu à ${this.state.offset.price}€`, 'success');
    }
    
    resetOffset() {
        this.state.offset.status = 'none';
        this.updateOffsetDisplay();
        this.updateCommercialSummary();
        this.updateValidateButton();
        this.showNotification('Offset réinitialisé', 'info');
    }
    
    updateOffsetDisplay() {
        const counter = document.getElementById('offset-counter');
        const statusText = document.querySelector('#offset-status .status-text');
        const priceDisplay = document.getElementById('offset-price-display');
        
        switch(this.state.offset.status) {
            case 'proposed':
                counter.textContent = 'Proposé';
                counter.style.background = '#FEF3C7';
                counter.style.color = '#92400E';
                statusText.textContent = 'Proposé au client';
                priceDisplay.textContent = `${this.state.offset.price}€/mois`;
                break;
                
            case 'sold':
                counter.textContent = 'Vendu ✅';
                counter.style.background = '#D1FAE5';
                counter.style.color = '#065F46';
                statusText.textContent = 'Vendu';
                priceDisplay.textContent = `${this.state.offset.price}€/mois`;
                break;
                
            default:
                counter.textContent = 'Non proposé';
                counter.style.background = '#F8FAFC';
                counter.style.color = '#64748B';
                statusText.textContent = 'Non proposé';
                priceDisplay.textContent = '';
        }
    }
    
    // === COMPTEURS ===
    updateClientCounter() {
        const fields = ['client-nom', 'client-prenom', 'client-email', 'client-telephone', 'client-ville'];
        let count = 0;
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value.trim()) {
                count++;
            }
        });
        
        document.getElementById('client-counter').textContent = `${count}/5`;
    }
    
    updateMentionsCounter() {
        const checkboxes = document.querySelectorAll('[data-section="mentions"]:checked');
        const count = checkboxes.length;
        
        const counter = document.getElementById('mentions-counter');
        counter.textContent = `${count}/4`;
        
        if (count === 4) {
            counter.style.background = '#D1FAE5';
            counter.style.color = '#065F46';
        } else {
            counter.style.background = '#F8FAFC';
            counter.style.color = '#64748B';
        }
    }
    
    updateAutresCounter() {
        const checkboxes = document.querySelectorAll('[data-section="autres"]:checked');
        document.getElementById('autres-counter').textContent = `${checkboxes.length}/2`;
    }
    
    updateAllCounters() {
        this.updateClientCounter();
        this.updateMentionsCounter();
        this.updateAutresCounter();
        this.updateAXADisplay();
        this.updateOffsetDisplay();
    }
    
    // === RÉSUMÉ COMMERCIAL ===
    updateCommercialSummary() {
        let soldCount = 0;
        let proposedCount = 0;
        let revenue = 0;
        
        // AXA
        if (this.state.axa.status === 'sold') {
            soldCount++;
            revenue += parseFloat(this.state.axa.price);
        } else if (this.state.axa.status === 'proposed') {
            proposedCount++;
        }
        
        // Offset
        if (this.state.offset.status === 'sold') {
            soldCount++;
            revenue += parseFloat(this.state.offset.price);
        } else if (this.state.offset.status === 'proposed') {
            proposedCount++;
        }
        
        // Autres services
        if (document.getElementById('service-mcp')?.checked) soldCount++;
        if (document.getElementById('service-voltalis')?.checked) soldCount++;
        
        // Mise à jour affichage
        document.getElementById('services-sold-count').textContent = soldCount;
        document.getElementById('services-proposed-count').textContent = proposedCount;
        document.getElementById('revenue-total').textContent = `${revenue.toFixed(2)}€`;
        
        // Statut objectif
        const goalStatus = document.getElementById('goal-status');
        if (soldCount >= 2) {
            goalStatus.textContent = '🎯 Objectif atteint !';
            goalStatus.style.color = '#059669';
        } else {
            goalStatus.textContent = `🎯 Objectif: ${2-soldCount} service(s) manquant(s)`;
            goalStatus.style.color = '#92400E';
        }
        
        this.updateTabBadges();
    }
    
    // === VALIDATION ===
    updateValidateButton() {
        const validateBtn = document.getElementById('validate-btn');
        
        // Vérifications
        const clientComplete = this.isClientComplete();
        const mentionsComplete = this.areMentionsComplete();
        const servicesMinimum = this.hasMinimumServices();
        
        const isValid = clientComplete && mentionsComplete && servicesMinimum;
        
        validateBtn.disabled = !isValid;
        
        if (isValid) {
            validateBtn.textContent = '✅ Valider la vente';
            validateBtn.style.background = '#10B981';
        } else {
            let missing = [];
            if (!clientComplete) missing.push('Client');
            if (!mentionsComplete) missing.push('Mentions');
            if (!servicesMinimum) missing.push('2 services min');
            
            validateBtn.textContent = `⚠️ ${missing.join(', ')} manquant(s)`;
            validateBtn.style.background = '#9CA3AF';
        }
    }
    
    isClientComplete() {
        const fields = ['client-nom', 'client-prenom', 'client-email', 'client-telephone', 'client-ville'];
        return fields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && field.value.trim();
        });
    }
    
    areMentionsComplete() {
        const required = ['mention-rgpd', 'mention-reseau', 'mention-frais', 'mention-retractation'];
        return required.every(id => document.getElementById(id)?.checked);
    }
    
    hasMinimumServices() {
        let count = 0;
        
        if (this.state.axa.status === 'sold') count++;
        if (this.state.offset.status === 'sold') count++;
        if (document.getElementById('service-mcp')?.checked) count++;
        if (document.getElementById('service-voltalis')?.checked) count++;
        
        return count >= 2;
    }
    
    // === VALIDATION MODAL ===
    validateSale() {
        if (!this.isClientComplete() || !this.areMentionsComplete() || !this.hasMinimumServices()) {
            this.showNotification('Validation impossible - Critères manquants', 'error');
            return;
        }
        
        this.openValidationModal();
    }
    
    openValidationModal() {
        const modal = document.getElementById('validation-modal');
        const summary = document.getElementById('validation-summary');
        
        // Génération du résumé
        const client = {
            nom: document.getElementById('client-nom').value,
            prenom: document.getElementById('client-prenom').value,
            email: document.getElementById('client-email').value,
            telephone: document.getElementById('client-telephone').value,
            ville: document.getElementById('client-ville').value
        };
        
        let servicesHtml = '';
        let revenue = 0;
        
        if (this.state.axa.status === 'sold') {
            servicesHtml += `<div>🛡️ AXA ${this.state.axa.price}€ - <strong>VENDU</strong></div>`;
            revenue += parseFloat(this.state.axa.price);
        }
        
        if (this.state.offset.status === 'sold') {
            servicesHtml += `<div>🌱 Offset ${this.state.offset.price}€ - <strong>VENDU</strong></div>`;
            revenue += parseFloat(this.state.offset.price);
        }
        
        if (document.getElementById('service-mcp')?.checked) {
            servicesHtml += `<div>💼 Mon Conseiller Perso - <strong>VENDU</strong></div>`;
        }
        
        if (document.getElementById('service-voltalis')?.checked) {
            servicesHtml += `<div>⚡ Voltalis - <strong>PLANIFIÉ</strong></div>`;
        }
        
        summary.innerHTML = `
            <div style="margin-bottom: 16px;">
                <h4 style="margin-bottom: 8px;">👤 Client</h4>
                <div style="font-size: 12px; color: #64748B;">
                    ${client.prenom} ${client.nom}<br>
                    ${client.email}<br>
                    ${client.telephone} - ${client.ville}
                </div>
            </div>
            
            <div style="margin-bottom: 16px;">
                <h4 style="margin-bottom: 8px;">💼 Services vendus</h4>
                <div style="font-size: 12px;">
                    ${servicesHtml || '<div>Aucun service vendu</div>'}
                </div>
            </div>
            
            <div style="text-align: center; padding: 12px; background: #F0FDF4; border-radius: 6px;">
                <div style="font-size: 14px; font-weight: 600; color: #059669;">
                    CA Total: ${revenue.toFixed(2)}€/mois
                </div>
            </div>
        `;
        
        modal.classList.add('show');
    }
    
    closeValidationModal() {
        document.getElementById('validation-modal').classList.remove('show');
    }
    
    // === HISTORIQUE ===
    saveToHistory() {
        const callDuration = this.callStartTime ? 
            Math.floor((Date.now() - this.callStartTime) / 1000) : 0;
        
        const client = {
            nom: document.getElementById('client-nom').value,
            prenom: document.getElementById('client-prenom').value,
            email: document.getElementById('client-email').value,
            telephone: document.getElementById('client-telephone').value,
            ville: document.getElementById('client-ville').value
        };
        
        let services = [];
        let revenue = 0;
        
        if (this.state.axa.status === 'sold') {
            services.push(`AXA ${this.state.axa.price}€`);
            revenue += parseFloat(this.state.axa.price);
        }
        
        if (this.state.offset.status === 'sold') {
            services.push(`Offset ${this.state.offset.price}€`);
            revenue += parseFloat(this.state.offset.price);
        }
        
        if (document.getElementById('service-mcp')?.checked) {
            services.push('MCP');
        }
        
        if (document.getElementById('service-voltalis')?.checked) {
            services.push('Voltalis');
        }
        
        const sale = {
            id: Date.now(),
            date: new Date().toISOString(),
            client,
            services,
            revenue,
            duration: callDuration,
            servicesCount: services.length
        };
        
        this.salesHistory.unshift(sale);
        
        if (this.salesHistory.length > 50) {
            this.salesHistory = this.salesHistory.slice(0, 50);
        }
        
        localStorage.setItem('selectra-simple-history', JSON.stringify(this.salesHistory));
        
        this.closeValidationModal();
        this.showNotification('Vente enregistrée avec succès !', 'success');
        
        // Reset et basculer vers l'historique
        this.resetAll(false);
        this.switchTab('history');
        
        console.log(`💾 Vente enregistrée: ${client.prenom} ${client.nom}`);
    }
    
    updateHistoryDisplay() {
        const historyList = document.getElementById('history-list');
        const totalSales = document.getElementById('total-sales');
        const totalRevenue = document.getElementById('total-revenue');
        
        totalSales.textContent = this.salesHistory.length;
        
        const totalRev = this.salesHistory.reduce((sum, sale) => sum + sale.revenue, 0);
        totalRevenue.textContent = `${totalRev.toFixed(0)}€`;
        
        if (this.salesHistory.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty">
                    <div class="history-empty-icon">📋</div>
                    <p>Aucune vente</p>
                </div>
            `;
            return;
        }
        
        let historyHTML = '';
        
        this.salesHistory.forEach((sale, index) => {
            const date = new Date(sale.date);
            const dateStr = date.toLocaleDateString('fr-FR');
            const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            
            historyHTML += `
                <div class="history-item" onclick="showSaleDetails(${index})">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <div style="font-weight: 600; font-size: 12px;">${sale.client.prenom} ${sale.client.nom}</div>
                        <div style="font-size: 10px; color: #64748B;">${dateStr} ${timeStr}</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 11px; color: #64748B;">${sale.services.join(', ') || 'Aucun service'}</div>
                        <div style="font-size: 11px; font-weight: 600; color: #059669;">${sale.revenue.toFixed(2)}€</div>
                    </div>
                </div>
            `;
        });
        
        historyList.innerHTML = historyHTML;
    }
    
    clearHistory() {
        if (confirm('Vider tout l\'historique des ventes ?')) {
            this.salesHistory = [];
            localStorage.removeItem('selectra-simple-history');
            this.updateHistoryDisplay();
            this.updateTabBadges();
            this.showNotification('Historique vidé', 'warning');
        }
    }
    
    // === TIMER D'APPEL ===
    startCall() {
        if (this.isCallActive) {
            this.stopCall();
            return;
        }
        
        this.callStartTime = Date.now();
        this.isCallActive = true;
        
        const startBtn = document.getElementById('start-call');
        startBtn.textContent = '🛑 Arrêter';
        startBtn.style.background = 'rgba(239, 68, 68, 0.2)';
        
        this.callTimer = setInterval(() => {
            this.updateCallTimer();
        }, 1000);
        
        this.showNotification('Appel démarré !', 'info');
    }
    
    stopCall() {
        if (this.callTimer) {
            clearInterval(this.callTimer);
        }
        
        const callDuration = this.callStartTime ? 
            Math.floor((Date.now() - this.callStartTime) / 1000) : 0;
        
        this.isCallActive = false;
        
        const startBtn = document.getElementById('start-call');
        startBtn.textContent = '📞 Démarrer';
        startBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        
        this.showNotification(`Appel terminé (${this.formatDuration(callDuration)})`, 'info');
    }
    
    updateCallTimer() {
        if (!this.callStartTime) return;
        
        const elapsed = Math.floor((Date.now() - this.callStartTime) / 1000);
        document.getElementById('call-timer').textContent = this.formatDuration(elapsed);
    }
    
    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // === UTILITAIRES ===
    updateTabBadges() {
        // Badge checklist - progression globale
        const clientCount = document.getElementById('client-counter').textContent;
        const mentionsCount = document.getElementById('mentions-counter').textContent;
        
        const clientProgress = parseInt(clientCount.split('/')[0]) / parseInt(clientCount.split('/')[1]) * 100;
        const mentionsProgress = parseInt(mentionsCount.split('/')[0]) / parseInt(mentionsCount.split('/')[1]) * 100;
        
        const totalProgress = Math.round((clientProgress + mentionsProgress) / 2);
        
        const checklistBadge = document.getElementById('checklist-badge');
        checklistBadge.textContent = totalProgress + '%';
        checklistBadge.className = totalProgress >= 80 ? 'tab-badge success' : 'tab-badge';
        
        // Badge historique
        const historyBadge = document.getElementById('history-badge');
        historyBadge.textContent = this.salesHistory.length;
        historyBadge.className = 'tab-badge success';
    }
    
    resetAll(confirm = true) {
        if (confirm && !window.confirm('Réinitialiser toute la checklist ?')) {
            return;
        }
        
        // Arrêter l'appel si actif
        if (this.isCallActive) {
            this.stopCall();
        }
        
        // Reset champs client
        ['client-nom', 'client-prenom', 'client-email', 'client-telephone', 'client-ville'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });
        
        // Reset checkboxes mentions
        document.querySelectorAll('[data-section="mentions"]').forEach(cb => {
            cb.checked = false;
        });
        
        // Reset checkboxes autres
        document.querySelectorAll('[data-section="autres"]').forEach(cb => {
            cb.checked = false;
        });
        
        // Reset services
        this.state.axa.status = 'none';
        this.state.offset.status = 'none';
        
        // Reset timer
        this.callStartTime = null;
        document.getElementById('call-timer').textContent = '00:00';
        
        // Mise à jour affichage
        this.updateAllCounters();
        this.updateCommercialSummary();
        this.updateValidateButton();
        this.updateTabBadges();
        
        if (confirm) {
            this.showNotification('Checklist réinitialisée', 'info');
        }
        
        console.log('🔄 Reset complet effectué');
    }
    
    saveState() {
        const state = {
            ...this.state,
            callStartTime: this.callStartTime,
            isCallActive: this.isCallActive,
            currentTab: this.currentTab,
            timestamp: Date.now()
        };
        
        localStorage.setItem('selectra-simple-state', JSON.stringify(state));
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
        
        console.log(`📣 ${type.toUpperCase()}: ${message}`);
    }
}

// === FONCTIONS GLOBALES ===

// Navigation
window.switchTab = (tabName) => {
    if (window.app) {
        window.app.switchTab(tabName);
    }
};

// Timer
window.startCall = () => {
    if (window.app) {
        window.app.startCall();
    }
};

// Services AXA
window.selectAXAOption = (element) => {
    if (window.app) {
        window.app.selectAXAOption(element);
    }
};

window.proposeAXA = () => {
    if (window.app) {
        window.app.proposeAXA();
    }
};

window.sellAXA = () => {
    if (window.app) {
        window.app.sellAXA();
    }
};

window.resetAXA = () => {
    if (window.app) {
        window.app.resetAXA();
    }
};

// Services Offset
window.selectOffsetOption = (element) => {
    if (window.app) {
        window.app.selectOffsetOption(element);
    }
};

window.proposeOffset = () => {
    if (window.app) {
        window.app.proposeOffset();
    }
};

window.sellOffset = () => {
    if (window.app) {
        window.app.sellOffset();
    }
};

window.resetOffset = () => {
    if (window.app) {
        window.app.resetOffset();
    }
};

// Validation
window.validateSale = () => {
    if (window.app) {
        window.app.validateSale();
    }
};

window.closeValidationModal = () => {
    if (window.app) {
        window.app.closeValidationModal();
    }
};

window.saveToHistory = () => {
    if (window.app) {
        window.app.saveToHistory();
    }
};

// Actions générales
window.resetAll = () => {
    if (window.app) {
        window.app.resetAll();
    }
};

window.clearHistory = () => {
    if (window.app) {
        window.app.clearHistory();
    }
};

// Historique
window.showSaleDetails = (index) => {
    if (!window.app || !window.app.salesHistory[index]) return;
    
    const sale = window.app.salesHistory[index];
    
    const details = `
📋 DÉTAIL DE LA VENTE

👤 Client: ${sale.client.prenom} ${sale.client.nom}
📧 Email: ${sale.client.email}
📞 Téléphone: ${sale.client.telephone}
🏠 Ville: ${sale.client.ville}

💼 Services: ${sale.services.join(', ') || 'Aucun service'}
💰 CA: ${sale.revenue.toFixed(2)}€/mois
⏱️ Durée: ${window.app.formatDuration(sale.duration)}
📅 Date: ${new Date(sale.date).toLocaleString('fr-FR')}
    `.trim();
    
    alert(details);
};

// === INITIALISATION ===
window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Démarrage Selectra Simplifiée...');
    
    try {
        window.app = new SelectraSimplified();
        console.log('✅ Application opérationnelle');
    } catch (error) {
        console.error('❌ Erreur initialisation:', error);
        alert('Erreur de chargement. Veuillez actualiser.');
    }
});

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('❌ Erreur:', event.error);
    if (window.app) {
        window.app.showNotification('Une erreur est survenue', 'error');
    }
});