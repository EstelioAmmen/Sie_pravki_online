import { useState } from 'react';
import { ShoppingCart, X, ChevronDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { AuthModal } from '@/components/auth/AuthModal';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { InventoryView } from '@/components/inventory/InventoryView';
import { GameSelector } from '@/components/inventory/GameSelector';
import { InventoryDisplay } from '@/components/inventory/InventoryDisplay';
import { LoadingModal } from '@/components/common/LoadingModal';
import { currencies } from '@/constants/currencies';
import { SteamProvider } from '@/contexts/SteamContext';

import { useAuth } from '@/hooks/useAuth';
import { useInventory } from '@/hooks/useInventory';
import { useCart } from '@/hooks/useCart';

function AppContent() {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const auth = useAuth();
  const inventory = useInventory();
  const cart = useCart();

  const cartItemCount = cart.cartItems.length;

  const handleInventoryCheck = async () => {
    if (!auth.user) {
      auth.setShowAuthModal(true);
      return;
    }

    const success = await inventory.handleInventoryCheck(auth.user, auth.profileUrl);
    if (!success) {
      // Handle error case if needed
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#191C22] text-white">
      <Header {...auth} />

      <HeroBanner />

      <div className="p-6 w-full">
        <div className="w-full min-h-[calc(100vh-4rem)] rounded-2xl bg-[#1E2128] p-8 shadow-lg">
          <div className="w-full text-center mt-6 mb-8">
            <p className="text-base leading-relaxed text-white/90 mb-3">
              SkinSpace Sorter – это сервис, позволяющий узнать стоимость инвентаря по каждой игре из вашего аккаунта в Steam.
            </p>
            <p className="text-base leading-relaxed text-white/90">
              Наш сайт позволяет оценить стоимость инвентаря таких игр как: CS:GO, DOTA 2, RUST и других.
            </p>
          </div>

          <div className="w-full">
            <label className="block text-sm text-white/70 mb-4 text-center">
              Вставьте в данное поле ссылку на ваш профиль в Steam, Steam ID или ссылку на Маркет и выберите валюту.
            </label>

            <div className="flex items-center justify-center gap-3 max-w-[1000px] mx-auto">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={auth.profileUrl}
                    onChange={(e) => auth.setProfileUrl(e.target.value)}
                    onFocus={() => !auth.user && auth.setShowAuthModal(true)}
                    placeholder="https://steamcommunity.com/profiles/76561112345678910/"
                    className="w-full h-10 bg-[#313131] border-2 border-[#414141] rounded-lg px-3 text-sm text-white/90 placeholder:text-white/50 focus:outline-none focus:border-[#3C73DD]"
                  />
                  {auth.profileUrl && (
                    <button
                      onClick={() => auth.setProfileUrl('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <button 
                  ref={inventory.checkButtonRef}
                  className={`h-10 px-6 bg-[#3C73DD] hover:bg-[#4d82ec] hover:scale-[1.02] transition-all duration-200 rounded-lg font-bold text-sm text-white/95 shadow-lg shadow-[#3C73DD]/20 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[#3C73DD] flex items-center gap-2`}
                  onClick={handleInventoryCheck}
                  disabled={inventory.isLoading}
                >
                  {inventory.isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white/90 rounded-full animate-spin"></div>
                      <span>ЗАГРУЗКА...</span>
                    </>
                  ) : (
                    'УЗНАТЬ СТОИМОСТЬ'
                  )}
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-10 w-[150px] bg-[#2C3035] rounded-lg px-3 text-sm text-white/90 flex items-center justify-between border-2 border-[#414141] focus:outline-none focus:border-[#3C73DD]"
                >
                  <span>{`${selectedCurrency.label} (${selectedCurrency.symbol})`}</span>
                  <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-12 right-0 w-[150px] bg-[#2C3035] rounded-xl border-2 border-white/20 shadow-lg z-50">
                    {currencies.map((currency) => (
                      <button
                        key={currency.symbol}
                        onClick={() => {
                          setSelectedCurrency(currency);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#3C73DD]/20 transition-colors ${
                          selectedCurrency.symbol === currency.symbol ? 'text-white' : 'text-white/50'
                        }`}
                      >
                        {`${currency.label} (${currency.symbol})`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <GameSelector
              selectedGame={inventory.selectedGame}
              onSelect={inventory.setSelectedGame}
            />

            {inventory.showInventory && auth.user?.steamid && (
              <InventoryDisplay
                steamId={auth.user.steamid}
                selectedGame={inventory.selectedGame}
                currency={selectedCurrency}
                onToggleCart={cart.toggleItemInCart}
              />
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => cart.setIsCartOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#2C3035] rounded-full shadow-lg flex items-center justify-center hover:bg-[#3C3C3C] transition-all duration-200 z-[10000] hover:scale-110"
        style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' }}
      >
        <ShoppingCart size={20} className="text-white" />
        {cartItemCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-[#3C73DD] rounded-full flex items-center justify-center px-1.5 text-xs font-bold text-white">
            {cartItemCount}
          </div>
        )}
      </button>

      <LoadingModal
        isOpen={inventory.showLoadingModal}
        steps={inventory.loadingSteps}
        onClose={inventory.handleCloseLoadingModal}
      />

      <CartSidebar
        isOpen={cart.isCartOpen}
        onClose={() => cart.setIsCartOpen(false)}
        items={cart.cartItems}
        currency={selectedCurrency}
        onRemoveItem={cart.toggleItemInCart}
      />

      <AuthModal
        isOpen={auth.showAuthModal}
        onClose={() => auth.setShowAuthModal(false)}
        onLogin={auth.handleLogin}
      />
    </main>
  );
}

function App() {
  return (
    <SteamProvider>
      <AppContent />
    </SteamProvider>
  );
}

export default App;