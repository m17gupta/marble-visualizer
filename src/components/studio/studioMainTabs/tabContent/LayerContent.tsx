import React, { useState, useMemo, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppDispatch } from '@/redux/hooks'
import { clearTestCanvas, setAnnotation, setBbInt } from '@/redux/slices/TestCanvasSlices'

const LayerContent = () => {
  const [inputValue, setInputValue] = useState('')
  const [isFormatted, setIsFormatted] = useState(false)
   const dispatch = useAppDispatch()
  const parsedData = useMemo(() => {
    if (!inputValue.trim()) return null
    
    try {
      return JSON.parse(inputValue)
    } catch (error) {
      return null
    }
  }, [inputValue])

  const formatJSON = () => {
    if (parsedData) {
      const formatted = JSON.stringify(parsedData, null, 2)
      setInputValue(formatted)
      setIsFormatted(true)
    }
  }

  const clearInput = () => {
    setInputValue('')
    setIsFormatted(false)
    dispatch(clearTestCanvas())
  }

  const getDataStats = () => {
    if (!parsedData) return null
    
    if (parsedData.results && Array.isArray(parsedData.results)) {
      const result = parsedData.results[0]
     // convert polygon inito number Array
      if (result?.polygon && Array.isArray(result.polygon)) {
       const flattened: number[] = result?.polygon.flat();
         dispatch(setAnnotation(flattened))
         dispatch(setBbInt(result.box||[]))
      }
      return {
        status: parsedData.status,
        resultsCount: parsedData.results.length,
        label: result?.label,
        score: result?.score,
        polygonPoints: result?.polygon?.length || 0
      }
    }
    
    return null
  }

  const stats = getDataStats()


  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="response-input" className="text-sm font-medium">
            Paste JSON Response
          </Label>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={formatJSON}
              disabled={!parsedData}
            >
              Format JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearInput}
              disabled={!inputValue}
            >
              Clear
            </Button>
          </div>
        </div>
        
        <textarea
          id="response-input"
          placeholder="Paste your JSON response here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full h-40 p-3 text-sm font-mono border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        
     
      </div>
      
  

      {parsedData && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Formatted JSON Output</Label>
          <div className="max-h-96 overflow-auto border rounded-md">
            <pre className="p-4 text-xs font-mono bg-muted">
              <code>{JSON.stringify(parsedData, null, 2)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default LayerContent