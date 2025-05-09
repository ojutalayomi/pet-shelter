import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Error404Page from './404'
import { ModalRoute } from './modal-route'
// import { PetProfile } from '@/types/type'

const SignIn = lazy(() => import ('@/pages/accounts/SignIn'))
const SignUp = lazy(() => import ('@/pages/accounts/SignUp'))
const ConfirmEmail = lazy(() => import ('@/pages/accounts/ConfirmEmail'))
const ForgotPassword = lazy(() => import ('@/pages/accounts/ForgotPassword'))
const ResetPassword = lazy(() => import ('@/pages/accounts/ResetPassword'))
const Profile = lazy(() => import ('@/pages/accounts/Profile'))
const LogOut = lazy(() => import ('@/pages/accounts/LogOut'))
const SwitchUser = lazy(() => import ('@/pages/accounts/SwitchUser'))

const Applications = lazy(() => import ('@/pages/admin/Applications'))
const Invite = lazy(() => import ('@/pages/admin/Invite'))
const Dashboard = lazy(() => import ('@/pages/admin/Dashboard'))
const ManageUsers = lazy(() => import ('@/pages/admin/ManageUsers'))
const ScheduledVisits = lazy(() => import('@/pages/admin/ScheduledVisits'))
const EmergencyCareRequestsForAdmin = lazy(() => import ('@/pages/admin/EmergencyCareRequests'))

const PetList = lazy(() => import ('@/pages/PetList'))
const EmergencyCare = lazy(() => import ('@/pages/EmergencyCare'))
const EmergencyCareRequests = lazy(() => import ('@/pages/EmergencyCareRequests'))

const Settings = lazy(() => import ('@/pages/settings/Settings'))
const Permissions = lazy(() => import ('@/pages/settings/Permissions'))
const Notifications = lazy(() => import ('@/pages/settings/Notifications'))
const ShelterInfo = lazy(() => import ('@/pages/settings/ShelterInfo')) 
const ScheduleVisit = lazy(() => import ('@/pages/ScheduleVisit'))

const AdoptionCenter = lazy(() => import ('@/pages/AdoptionCenter'))
const AdoptionProcess = lazy(() => import ('@/pages/AdoptionProcess'))
const AdoptionApplication = lazy(() => import ('@/pages/AdoptionApplication'))
const AdoptionApplicationList = lazy(() => import ('@/pages/AdoptionApplicationList'))
const AdoptionApplicationDetail = lazy(() => import ('@/pages/AdoptionApplicationDetail'))
const AdoptionApplicationDetailEdit = lazy(() => import ('@/pages/AdoptionApplicationDetailEdit'))

const Analytics = lazy(() => import ('@/pages/Analytics'))
const Menu = lazy(() => import ('@/pages/Menu'))
const PetDetail = lazy(() => import ('@/pages/PetDetail'))
const EditPet = lazy(() => import ('@/pages/EditPet'))
const AddPet = lazy(() => import ('@/pages/AddPet'))

function Main() {
  const user = useSelector((state: RootState) => state.user)
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location }
  const backgroundLocation = state?.backgroundLocation

  // Check if we're accessing invite directly
  const isDirectAccess = (path: string) => {
    return location.pathname === path && !backgroundLocation
  }

  return (
    <>
      <Routes location={backgroundLocation || location}>

        <Route path='/error' element={<Error404Page />}/>

        {/* Accounts */}

        <Route path='/accounts/*' element={
          <Routes>
            <Route path='login' element={<Suspense fallback={<></>}><SignIn /></Suspense>}/>
            <Route path='signup' element={<Suspense fallback={<></>}><SignUp /></Suspense>}/>
            <Route path='confirm-email' element={<Suspense fallback={<></>}><ConfirmEmail /></Suspense>}/>
            <Route path='forgot-password' element={<Suspense fallback={<></>}><ForgotPassword /></Suspense>}/>
            <Route path='reset-password' element={<Suspense fallback={<></>}><ResetPassword /></Suspense>}/>
            <Route path='profile' element={<Suspense fallback={<></>}><Profile /></Suspense>}/>
            {isDirectAccess('/accounts/switch-user') && (
              <Route path="switch-user" element={
                <Suspense fallback={<></>}>
                  <SwitchUser />
                </Suspense>
              } />
            )}
            <Route path='logout' element={<Suspense fallback={<></>}><LogOut /></Suspense>}/>
          </Routes>
        }/>

        {/* Admin */}

        <Route path='/admin/*' element={
          // Check if the user is an admin
          user.role === 'admin' ? (
            <Routes>
              <Route path='dashboard' element={<Suspense fallback={<></>}><Dashboard /></Suspense>}/>

              {isDirectAccess('/admin/invite') && (
                <Route path="invite" element={
                  <Suspense fallback={<></>}>
                    <Invite />
                  </Suspense>
                } />
              )}

              {isDirectAccess('/admin/applications') && (
                <Route path="applications" element={
                  <Suspense fallback={<></>}>
                    <Applications />
                  </Suspense>
                } />
              )}

              <Route path='pets/add' element={<Suspense fallback={<></>}><AddPet /></Suspense>}/>

              <Route path='users' element={<Suspense fallback={<></>}><ManageUsers /></Suspense>}/>

              <Route path='visits' element={<Suspense fallback={<></>}><ScheduledVisits /></Suspense>}/>

              <Route path='emergency-care' element={<Suspense fallback={<></>}><EmergencyCareRequestsForAdmin /></Suspense>}/>

              <Route path='*' element={<Error404Page />}/>
            </Routes>
          ) : (
            // Redirect or show an error for non-admin users
            <Navigate to="/error" /> // Adjust the path as needed
          )
        }/>

        {/* Pet Detail */}

        <Route path='/pet/:petId' element={<Suspense fallback={<></>}><PetDetail /></Suspense>}/>

        <Route path='/pet/:petId/edit' element={<Suspense fallback={<></>}><EditPet /></Suspense>}/>

        <Route path='/schedule-visit' element={<Suspense fallback={<></>}><ScheduleVisit /></Suspense>}/>

        <Route path='/emergency-care/*' element={
          <Routes>
            <Route path='' element={<Suspense fallback={<></>}><EmergencyCare /></Suspense>}/>
            <Route path='requests' element={<Suspense fallback={<></>}><EmergencyCareRequests /></Suspense>}/>
          </Routes>
        }/>

        <Route path='/quick-actions' element={<Suspense fallback={<></>}><Menu /></Suspense>}/>

        <Route path='/pet-management' element={<Suspense fallback={<></>}><Menu filter='pet-management'/></Suspense>}/>

        <Route path='/healthcare' element={<Suspense fallback={<></>}><Menu filter='healthcare'/></Suspense>}/>

        {/* Settings */}

        <Route path='/settings/*' element={
          <Routes>
            <Route path='' element={<Suspense fallback={<></>}><Menu filter='settings'/></Suspense>}/>
            <Route path='account' element={<Suspense fallback={<></>}><Settings /></Suspense>}/>
            <Route path='permissions' element={<Suspense fallback={<></>}><Permissions /></Suspense>}/>
            <Route path='notifications' element={<Suspense fallback={<></>}><Notifications /></Suspense>}/>
            <Route path='shelter-info' element={<Suspense fallback={<></>}><ShelterInfo /></Suspense>}/>
          </Routes>
        }/>

        {/* Help Center */}

        <Route path='/help-center' element={<Suspense fallback={<></>}><Menu filter='help-center' segment='navSecondary'/></Suspense>}/>

        <Route path='/contact-vet' element={<Suspense fallback={<></>}><Menu filter='contact-vet' segment='navSecondary'/></Suspense>}/>

        {/* Adoption */}

        <Route path='/adoption-center' element={<Suspense fallback={<></>}><AdoptionCenter /></Suspense>}/>

        <Route path='/adoption-process' element={<Suspense fallback={<></>}><AdoptionProcess /></Suspense>}/>

        <Route path='/adoption-applications' element={<Suspense fallback={<></>}><AdoptionApplicationList /></Suspense>}/>

        <Route path='/adoption-process/:petId' element={<Suspense fallback={<></>}><AdoptionApplication /></Suspense>}/>

        <Route path='/adoption-applications/:petId' element={<Suspense fallback={<></>}><AdoptionApplicationDetail /></Suspense>}/>

        <Route path='/adoption-applications/:petId/edit' element={<Suspense fallback={<></>}><AdoptionApplicationDetailEdit /></Suspense>}/>

        {/* Analytics */}

        <Route path='/analytics' element={<Suspense fallback={<></>}><Analytics /></Suspense>}/>

        <Route path='/financial' element={<Suspense fallback={<></>}><Menu filter='financial' segment='pages'/></Suspense>}/>

        {/* Pet Management */}

        <Route path='/pet-management/*' element={
          <Routes>
            <Route path='available-pets' element={<Suspense fallback={<></>}><PetList filter='available'/></Suspense>}/>
            <Route path='adopted-pets' element={<Suspense fallback={<></>}><PetList filter='adopted'/></Suspense>}/>
            <Route path='foster-care' element={<Suspense fallback={<></>}><PetList filter='fostered'/></Suspense>}/>
          </Routes>
        }/>

        <Route path='*' element={<Error404Page />}/>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/accounts/switch-user" 
            element={
              <ModalRoute title="Switch User">
                <Suspense fallback={<></>}>
                  <SwitchUser />
                </Suspense>
              </ModalRoute>
            }
          />
          <Route path="/admin/*" element={
            <Routes>
              <Route path="applications" 
                element={
                  <ModalRoute title="Adoption Applications">
                    <Suspense fallback={<></>}>
                      <Applications />
                    </Suspense>
                  </ModalRoute>
                }
              />
              <Route path="invite"
                element={
                  <ModalRoute title="Admin Invite">
                    <Suspense fallback={<></>}>
                      <Invite />
                    </Suspense>
                  </ModalRoute>
                }
              />
            </Routes>
          }/>
        </Routes>
      )}
    </>
  )
}

export default Main