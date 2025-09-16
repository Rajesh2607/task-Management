import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Play, Pause, Volume2, Maximize2, Users, Clock, Upload, Check, ArrowLeft } from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

interface DetailTaskProps {
  taskId: string | null
  onBack?: () => void
}

interface Task {
  _id: string
  title: string
  category: string
  progress: number
  timeLeft: string
  image: string
  teamMembers: string[]
  createdAt: string
  description?: string
  completed: boolean
}

const DetailTask: React.FC<DetailTaskProps> = ({ taskId, onBack }) => {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(140)
  const [duration] = useState(600)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [volume, setVolume] = useState(50)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showVolumeControl, setShowVolumeControl] = useState(false)

  useEffect(() => {
    if (!taskId) return
    
    const fetchTask = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching task with ID:', taskId)
        const res = await fetch(API_ENDPOINTS.TASK_BY_ID(taskId))
        console.log('Response status:', res.status)
        if (!res.ok) {
          const errorText = await res.text()
          console.error('Error response:', errorText)
          throw new Error(`Failed to fetch task: ${res.status} ${res.statusText}`)
        }
        const data = await res.json()
        console.log('Task data received:', data)
        setTask(data)
      } catch (error) {
        console.error('Error fetching task:', error)
        setError(`Failed to load task: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTask()
  }, [taskId])

  // Auto-play timer effect
  useEffect(() => {
    let interval: number
    if (isPlaying && currentTime < duration) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            return duration
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTime, duration])

  // Close volume control when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showVolumeControl) {
        setShowVolumeControl(false)
      }
    }
    
    if (showVolumeControl) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showVolumeControl])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (currentTime / duration) * 100
  const taskProgress = task?.progress || 0

  const assessmentItems = [
    `Understanding the tools in ${task?.category || 'the application'}`,
    'Understand the basics of making designs',
    `Designing a ${task?.category?.toLowerCase() || 'application'} using modern tools`,
    'Presenting the design flow and implementation',
  ]

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fileInput = e.currentTarget.elements.namedItem('file') as HTMLInputElement
    const file = fileInput?.files?.[0]
    if (!file) {
      setUploadStatus('No file selected.')
      return
    }
    setUploadStatus('Uploading...')
    setTimeout(() => {
      setUploadStatus('File saved in the cloud!')
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50">
        <Header title="Detail Task" showFilters={false} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading task...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50">
        <Header title="Detail Task" showFilters={false} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex-1 bg-gray-50">
        <Header title="Detail Task" showFilters={false} />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Task not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 lg:space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                title="Back to Explore"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900">Detail Task</h1>
          </div>
        </div>
      </div>
      <div className="p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden mb-6 relative group">
              <img
                src={task.image || 'https://via.placeholder.com/800x400?text=Task+Video'}
                alt="Video thumbnail"
                className="w-full h-48 lg:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 lg:p-4">
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm touch-manipulation"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    ) : (
                      <Play className="w-5 h-5 lg:w-6 lg:h-6 text-white ml-1" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div 
                      className="w-full bg-white/20 rounded-full h-2 cursor-pointer touch-manipulation"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = e.clientX - rect.left
                        const percentage = x / rect.width
                        setCurrentTime(Math.floor(percentage * duration))
                      }}
                    >
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-300 relative"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-white text-xs lg:text-sm font-medium min-w-[60px] lg:min-w-[80px]">
                    {formatTime(currentTime)}/{formatTime(duration)}
                  </span>
                  <div className="flex space-x-1 lg:space-x-2">
                    <div className="relative">
                      <button 
                        className="text-white/80 hover:text-white p-1 touch-manipulation"
                        title={`Volume: ${volume}%`}
                        onClick={() => setShowVolumeControl(!showVolumeControl)}
                      >
                        <Volume2 className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                      {showVolumeControl && (
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg p-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="w-16 lg:w-20 h-1 bg-white/20 rounded-lg appearance-none slider"
                          />
                          <div className="text-white text-xs text-center mt-1">{volume}%</div>
                        </div>
                      )}
                    </div>
                    <button 
                      className="text-white/80 hover:text-white p-1 touch-manipulation"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      <Maximize2 className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 mb-6">
              <div className="mb-4">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                  <span>{task.category}</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-left sm:text-center">
                    + Get Mentors
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">200 Students Involved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{task.timeLeft}</span>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                  {task.description || 
                    `Follow the video tutorial above. Understand how to use each tool in the
                    ${task.category} application. Also learn how to make a good and correct design.
                    Starting from spacing, typography, content, and many other design
                    hierarchies. Then try to make it yourself with your imagination and
                    inspiration.`
                  }
                </p>
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
                  Essence of Assessment
                </h3>
                <div className="space-y-3">
                  {assessmentItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        taskProgress > (index + 1) * 25 ? 'bg-green-500' : 'bg-blue-500'
                      }`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-sm lg:text-base ${
                        taskProgress > (index + 1) * 25 ? 'text-gray-900 line-through' : 'text-gray-700'
                      }`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
                Assigned Assignments
              </h3>
              <div className="mb-6">
                <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">{task.title}</h4>
                <p className="text-sm text-gray-500">{task.category}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Detail Student</h3>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">Student's name</span>
                  <span className="font-medium text-sm lg:text-base">Dennis Nzioki</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">Student Class</span>
                  <span className="font-medium text-sm lg:text-base">MIPA 2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">Student Number</span>
                  <span className="font-medium text-sm lg:text-base">10</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">File Task</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Last Modified</span>
                  <span className="font-medium">
                    {new Date(task.createdAt).toDateString()}
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">File submissions</p>
                <form
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 lg:p-8 text-center"
                  onSubmit={handleFileUpload}
                >
                  <Upload className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500 mb-4 mt-2"
                    id="file-upload"
                    name="file"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm lg:text-base hover:bg-blue-700 transition-colors mt-2 touch-manipulation"
                  >
                    Submit
                  </button>
                  {uploadStatus && (
                    <div className="mt-4 text-green-600 font-medium text-sm lg:text-base">
                      {uploadStatus}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailTask
