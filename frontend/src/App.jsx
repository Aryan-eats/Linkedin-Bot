import { useState } from 'react'
import axios from 'axios'

function App() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    jobTitle: '',
    experienceLevels: [],
    location: '',
    agreeToShare: false
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const experienceOptions = [
    'Intern',
    'Entry Level', 
    'Associate',
    'Mid-Senior level',
    'Director',
    'Executive'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'experienceLevel') {
      // Handle multiple experience level selection
      setFormData(prev => ({
        ...prev,
        experienceLevels: checked 
          ? [...prev.experienceLevels, value]
          : prev.experienceLevels.filter(level => level !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.agreeToShare) {
      setMessage({ type: 'error', text: 'Please agree to share your information' });
      return;
    }

    if (!formData.email || !formData.password || !formData.jobTitle || formData.experienceLevels.length === 0 || !formData.location) {
      setMessage({ type: 'error', text: 'Please fill in all required fields and select at least one experience level' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('http://localhost:3001/api/start-bot', {
        email: formData.email,
        password: formData.password,
        jobTitle: formData.jobTitle,
        experienceLevels: formData.experienceLevels,
        location: formData.location
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message });
        // Reset form on success
        setFormData({
          email: '',
          password: '',
          jobTitle: '',
          experienceLevels: [],
          location: '',
          agreeToShare: false
        });
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to connect to the server. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <nav className='w-full h-16 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 shadow-2xl flex items-center justify-center relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 animate-pulse'></div>
        <h1 className='text-3xl font-bold text-white tracking-wider hover:text-cyan-300 transition-all duration-300 relative z-10 drop-shadow-lg'>LinkPilot</h1>
      </nav>
      
      <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]'></div>
        <div className='absolute top-0 left-0 w-full h-full bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%230ea5e9%27%20fill-opacity%3D%270.05%27%3E%3Ccircle%20cx%3D%2730%27%20cy%3D%2730%27%20r%3D%271%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-30'></div>
        
        <div className='bg-gradient-to-br from-gray-900/80 via-gray-800/90 to-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-cyan-500/30 relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5'></div>
          <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400'></div>
          
          <h2 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-6 text-center drop-shadow-lg relative z-10'>Form Questions</h2>
          
          {/* Message Display */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg relative z-10 ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-400/30 text-green-300' 
                : 'bg-red-500/20 border border-red-400/30 text-red-300'
            }`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className='space-y-6 relative z-10'>
            <div className='group'>
              <label className='block text-cyan-300 font-medium mb-2 text-sm uppercase tracking-wider'>LinkedIn Email?</label>
              <input 
                type='email' 
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm group-hover:border-cyan-400/50' 
                placeholder='Enter your email' 
              />
            </div>
            
            <div className='group'>
              <label className='block text-cyan-300 font-medium mb-2 text-sm uppercase tracking-wider'>LinkedIn Password</label>
              <input 
                type='password' 
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                className='w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm group-hover:border-cyan-400/50' 
                placeholder='Enter your password' 
              />
            </div>
            
            <div className='group'>
              <label className='block text-cyan-300 font-medium mb-2 text-sm uppercase tracking-wider'>Job title?</label>
              <input 
                type='text' 
                name='jobTitle'
                value={formData.jobTitle}
                onChange={handleInputChange}
                className='w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm group-hover:border-cyan-400/50' 
                placeholder='Enter your job title' 
              />
            </div>
            
            <div className='group'>
              <label className='block text-cyan-300 font-medium mb-2 text-sm uppercase tracking-wider'>What&apos;s your experience level?</label>
              <div className='space-y-2 max-h-32 overflow-y-auto bg-gray-800/30 rounded-lg p-3 border border-cyan-500/20'>
                {experienceOptions.map((level) => (
                  <label key={level} className='flex items-center cursor-pointer hover:bg-gray-700/30 p-2 rounded transition-colors'>
                    <input 
                      type='checkbox' 
                      name='experienceLevel'
                      value={level}
                      checked={formData.experienceLevels.includes(level)}
                      onChange={handleInputChange}
                      className='mr-3 w-4 h-4 text-cyan-400 bg-gray-800 border-cyan-500/30 rounded focus:ring-cyan-400 focus:ring-2' 
                    />
                    <span className='text-cyan-300 text-sm'>{level}</span>
                  </label>
                ))}
              </div>
              {formData.experienceLevels.length > 0 && (
                <p className='text-xs text-cyan-400 mt-1'>
                  Selected: {formData.experienceLevels.join(', ')}
                </p>
              )}
            </div>
            
            <div className='group'>
              <label className='block text-cyan-300 font-medium mb-2 text-sm uppercase tracking-wider'>What&apos;s your location?</label>
              <input 
                type='text' 
                name='location'
                value={formData.location}
                onChange={handleInputChange}
                className='w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm group-hover:border-cyan-400/50' 
                placeholder='Country/City/State' 
              />
            </div>
            
            <div className='group'>
              <label className='flex items-center cursor-pointer'>
                <input 
                  type='checkbox' 
                  name='agreeToShare'
                  checked={formData.agreeToShare}
                  onChange={handleInputChange}
                  className='mr-3 w-4 h-4 text-cyan-400 bg-gray-800 border-cyan-500/30 rounded focus:ring-cyan-400 focus:ring-2' 
                />
                <span className='text-cyan-300 text-sm'>I agree to share this information</span>
              </label>
            </div>
            
            <button 
              type='submit' 
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-medium text-lg shadow-lg transition-all duration-300 transform ${
                loading 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 hover:shadow-cyan-500/25 hover:scale-105'
              }`}
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App