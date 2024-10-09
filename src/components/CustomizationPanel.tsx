import React, { useEffect } from 'react'
import { Upload } from 'lucide-react'

interface CustomizationPanelProps {
  context: string
  outputFormat: string
  onContextChange: (context: string) => void
  onOutputFormatChange: (format: string) => void
  onFileUpload: (files: FileList | null) => void
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  context,
  outputFormat,
  onContextChange,
  onOutputFormatChange,
  onFileUpload,
}) => {
  const testingContexts = [
    'Functional Testing',
    'Unit Testing',
    'Integration Testing',
    'UI Testing',
    'API Testing',
  ]

  const sampleOutputFormats = {
    'Functional Testing': `Test Case ID: [ID]
Description: [Brief description of the test case]
Preconditions: [List of preconditions]
Steps:
1. [Step 1]
2. [Step 2]
...
Expected Result: [Expected outcome]
Actual Result: [To be filled during testing]
Status: [Pass/Fail]
Notes: [Any additional information]`,

    'Unit Testing': `Test Function: [Function name]
Description: [Brief description of the test]
Input:
  - [Parameter 1]: [Value]
  - [Parameter 2]: [Value]
...
Expected Output: [Expected return value or behavior]
Assertions:
1. [Assertion 1]
2. [Assertion 2]
...
Edge Cases:
- [Edge case 1]
- [Edge case 2]
...`,

    'Integration Testing': `Test Scenario: [Scenario name]
Components Involved: [List of components or services]
Preconditions: [List of preconditions]
Test Steps:
1. [Step 1]
2. [Step 2]
...
Expected Results:
- [Expected result 1]
- [Expected result 2]
...
Data Requirements: [Any specific data needed]
Rollback Procedure: [Steps to rollback changes if needed]`,

    'UI Testing': `Test Case ID: [ID]
UI Component: [Name of the UI component]
Description: [Brief description of the test]
Preconditions: [List of preconditions]
Test Steps:
1. [Step 1]
2. [Step 2]
...
Expected Results:
- [Visual expectation 1]
- [Functional expectation 1]
...
Browser/Device: [Specific browser or device requirements]
Screenshots: [Placeholder for screenshots]`,

    'API Testing': `API Endpoint: [URL]
Method: [GET/POST/PUT/DELETE/etc.]
Description: [Brief description of the test]
Request Headers:
  [Header1]: [Value1]
  [Header2]: [Value2]
Request Body:
{
  [JSON structure of the request body]
}
Expected Response:
- Status Code: [Expected status code]
- Response Body:
{
  [Expected JSON structure of the response]
}
Assertions:
1. [Assertion 1]
2. [Assertion 2]
...
Error Scenarios:
- [Error scenario 1]
- [Error scenario 2]
...`
  }

  useEffect(() => {
    onOutputFormatChange(sampleOutputFormats[context])
  }, [context])

  return (
    <div className="w-1/3 bg-white p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Customization Panel</h2>
      
      <div className="mb-4">
        <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">
          Testing Context
        </label>
        <select
          id="context"
          value={context}
          onChange={(e) => onContextChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          {testingContexts.map((ctx) => (
            <option key={ctx} value={ctx}>
              {ctx}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
          Upload Files
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: TXT, JSON, YAML, CSV
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              onChange={(e) => onFileUpload(e.target.files)}
            />
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="output-format" className="block text-sm font-medium text-gray-700 mb-1">
          Output Format
        </label>
        <textarea
          id="output-format"
          value={outputFormat}
          onChange={(e) => onOutputFormatChange(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={10}
          placeholder="Specify output format (e.g., naming conventions, details, formatting style)"
        ></textarea>
      </div>
    </div>
  )
}

export default CustomizationPanel