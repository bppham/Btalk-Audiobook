import { GoogleOAuthProvider } from "@react-oauth/google";

// Thay thế YOUR_GOOGLE_CLIENT_ID bằng clientId thật của bạn
const clientId = "183260245351-2k1ksbh7d76sgs1k9m9k9qo7809ts8g6.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <div className="container">
                  <Sidebar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/:id" element={<AudioBook />} />
                  </Routes>
                </div>
              </>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
