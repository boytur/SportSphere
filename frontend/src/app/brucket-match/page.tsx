/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/
'use client'

import React, { useEffect, useState } from 'react'
import ReactFlow, { Background, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'
import BrucketDisplay from '@/components/RenderBracket'
import LabelNode from '../admin/brucket-match/label-node'

// Define the node type for the brackets
const nodeTypes = { brucket: BrucketDisplay,label: LabelNode }

const RenderBracket: React.FC = () => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch sport type from query parameters
  const sport =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('sport') || 'rov'
      : 'rov'

  useEffect(() => {
    const fetchBracketData = async () => {
      try {
        const response = await fetch(`/assets/data/${sport}.json`)
        if (!response.ok) throw new Error(`Failed to load ${sport}.json`)
        const data = await response.json()

        setNodes(data.nodes || [])
        setEdges(data.edges || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBracketData()
  }, [sport])

  if (loading) {
    return <div className='text-center text-gray-500'>Loading...</div>
  }

  if (error) {
    return <div className='text-center text-red-500'>{error}</div>
  }

  return (
    <div style={{ height: '100vh', backgroundColor: '#f4f4f4' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  )
}

export default RenderBracket
