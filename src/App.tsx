import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Editor } from '@/components/Editor';
import { StravaCallback } from '@/pages/StravaCallback';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Editor />} />
                    <Route path="/strava/callback" element={<StravaCallback />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
