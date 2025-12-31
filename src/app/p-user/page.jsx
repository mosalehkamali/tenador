'use client'

import { lazy, Suspense } from 'react'
import { useDashboardStore } from '@/lib/store'
import UserDashboardLayout from '@/components/UserDashboardLayout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Lazy load modules
const ProfileModule = lazy(() => import('@/components/modules/profile/index.jsx'))
const CartModule = lazy(() => import('@/components/modules/cart/index.jsx'))
const WishlistModule = lazy(() => import('@/components/modules/wishlist/index.jsx'))
const OrdersModule = lazy(() => import('@/components/modules/orders/index.jsx'))
const PaymentsModule = lazy(() => import('@/components/modules/payments/index.jsx'))
const AddressesModule = lazy(() => import('@/components/modules/addresses/index.jsx'))
const WalletModule = lazy(() => import('@/components/modules/wallet/index.jsx'))
const InstallmentsModule = lazy(() => import('@/components/modules/installments/index.jsx'))
const TicketsModule = lazy(() => import('@/components/modules/tickets/index.jsx'))

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

const renderModule = (module) => {
  switch (module) {
    case 'profile':
      return <ProfileModule />
    case 'cart':
      return <CartModule />
    case 'wishlist':
      return <WishlistModule />
    case 'orders':
      return <OrdersModule />
    case 'payments':
      return <PaymentsModule />
    case 'addresses':
      return <AddressesModule />
    case 'wallet':
      return <WalletModule />
    case 'installments':
      return <InstallmentsModule />
    case 'tickets':
      return <TicketsModule />
    default:
      return <ProfileModule />
  }
}

export default function UserDashboard() {
  const { currentModule } = useDashboardStore()

  return (
    <UserDashboardLayout>
      <Suspense fallback={<LoadingFallback />}>
        {renderModule(currentModule)}
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </UserDashboardLayout>
  )
}
