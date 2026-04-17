"use client";
import { useState } from "react"
import { FaUpload, FaCamera, FaTimes } from "react-icons/fa"

export default function UploadPage() {
  const [image, setImage] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleWebcamCapture = () => {
    // TODO: Implement webcam capture
    console.log("Webcam capture")
  }

  const handleSubmit = async () => {
    if (!image) return

    setLoading(true)

    // TODO: Call API to get prediction
    // For now, use mock data
    setTimeout(() => {
      setPrediction({
        predicted_mudra: "Abhaya",
        confidence: 0.95,
        sanskrit_name: "अभय",
        meaning: "Fearlessness",
        description: "Gesture of protection, blessing and peace. The right hand is raised to shoulder height, palm facing outward."
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Upload Mudra Image
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Upload Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG or GIF (MAX. 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={handleWebcamCapture}
              className="btn btn-secondary w-full flex items-center justify-center gap-2"
            >
              <FaCamera /> Capture from Webcam
            </button>
          </div>

          {image && (
            <div className="mb-6">
              <img
                src={image}
                alt="Uploaded mudra"
                className="max-w-full h-auto rounded-lg"
              />
              <button
                onClick={() => setImage(null)}
                className="mt-2 text-red-500 flex items-center gap-1"
              >
                <FaTimes /> Remove Image
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!image || loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Analyzing..." : "Analyze Mudra"}
          </button>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Result</h2>

          {prediction ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  {prediction.predicted_mudra}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {prediction.sanskrit_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Meaning:</strong> {prediction.meaning}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Description:</strong> {prediction.description}
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span>Confidence</span>
                  <span>{(prediction.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Upload an image to see the analysis result.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
