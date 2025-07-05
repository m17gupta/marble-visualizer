import { Segment } from '@/redux/slices/segmentsSlice';

// Scaffolding data for segments to use in development and testing
export const mockSegments: Segment[] = [
  {
    id: "seg_001",
    name: "Living Room Wall",
    type: "wall",
    points: [
      { x: 50, y: 50 },
      { x: 350, y: 50 },
      { x: 350, y: 200 },
      { x: 50, y: 200 }
    ],
    fillColor: "#E8DAEF",
    strokeColor: "#000000",
    strokeWidth: 2,
    opacity: 0.85,
    visible: true,
    zIndex: 10,
    createdAt: "2025-06-25T15:30:45.123Z",
    updatedAt: "2025-06-28T09:15:22.456Z",
    material: {
      materialId: "mat_12345",
      materialName: "Creamy White Paint",
      materialType: "color",
      color: "#F5F5F0",
      appliedAt: "2025-06-28T09:15:22.456Z"
    }
  },
  {
    id: "seg_002",
    name: "Kitchen Floor",
    type: "floor",
    points: [
      { x: 400, y: 50 },
      { x: 700, y: 50 },
      { x: 700, y: 200 },
      { x: 400, y: 200 }
    ],
    fillColor: "#D6EAF8",
    strokeColor: "#2471A3",
    strokeWidth: 1.5,
    opacity: 0.9,
    visible: true,
    zIndex: 5,
    createdAt: "2025-06-26T10:12:33.789Z",
    updatedAt: "2025-06-27T14:22:41.012Z",
    material: {
      materialId: "mat_67890",
      materialName: "Maple Hardwood",
      materialType: "texture",
      previewUrl: "https://example.com/materials/maple-preview.jpg",
      textureUrl: "https://example.com/textures/maple-hardwood.jpg",
      appliedAt: "2025-06-27T14:22:41.012Z"
    }
  },
  {
    id: "seg_003",
    name: "Bedroom Ceiling",
    type: "ceiling",
    points: [
      { x: 50, y: 250 },
      { x: 350, y: 250 },
      { x: 350, y: 400 },
      { x: 50, y: 400 }
    ],
    fillColor: "#FDEBD0",
    strokeColor: "#000000",
    strokeWidth: 1,
    opacity: 0.7,
    visible: true,
    zIndex: 15,
    createdAt: "2025-06-26T11:45:15.345Z",
    updatedAt: "2025-06-26T11:45:15.345Z"
  },
  {
    id: "seg_004",
    name: "Front Door",
    type: "door",
    points: [
      { x: 400, y: 250 },
      { x: 480, y: 250 },
      { x: 480, y: 350 },
      { x: 400, y: 350 }
    ],
    fillColor: "#E59866",
    strokeColor: "#784212",
    strokeWidth: 2.5,
    opacity: 1.0,
    visible: true,
    zIndex: 20,
    createdAt: "2025-06-27T08:30:20.678Z",
    updatedAt: "2025-07-01T16:45:33.901Z",
    material: {
      materialId: "mat_23456",
      materialName: "Oak Wood",
      materialType: "texture",
      previewUrl: "https://example.com/materials/oak-preview.jpg",
      textureUrl: "https://example.com/textures/oak-door.jpg",
      appliedAt: "2025-07-01T16:45:33.901Z"
    }
  },
  {
    id: "seg_005",
    name: "Kitchen Window",
    type: "window",
    points: [
      { x: 520, y: 250 },
      { x: 650, y: 250 },
      { x: 650, y: 320 },
      { x: 520, y: 320 }
    ],
    fillColor: "#AED6F1",
    strokeColor: "#2E86C1",
    strokeWidth: 2,
    opacity: 0.8,
    visible: true,
    zIndex: 25,
    createdAt: "2025-06-27T09:20:18.567Z",
    updatedAt: "2025-06-30T11:22:37.890Z"
  },
  {
    id: "seg_006",
    name: "Garage Roof",
    type: "roof",
    points: [
      { x: 100, y: 450 },
      { x: 300, y: 400 },
      { x: 500, y: 450 }
    ],
    fillColor: "#CD6155",
    strokeColor: "#922B21",
    strokeWidth: 1.5,
    opacity: 0.9,
    visible: true,
    zIndex: 8,
    createdAt: "2025-06-28T14:25:32.123Z",
    updatedAt: "2025-06-29T10:17:45.678Z",
    material: {
      materialId: "mat_34567",
      materialName: "Terracotta Tiles",
      materialType: "pattern",
      previewUrl: "https://example.com/materials/terracotta-preview.jpg",
      textureUrl: "https://example.com/textures/terracotta-tiles.jpg",
      appliedAt: "2025-06-29T10:17:45.678Z"
    }
  },
  {
    id: "seg_007",
    name: "Dining Room Wall",
    type: "wall",
    points: [
      { x: 550, y: 400 },
      { x: 750, y: 400 },
      { x: 750, y: 550 },
      { x: 550, y: 550 }
    ],
    fillColor: "#D5F5E3",
    strokeColor: "#000000",
    strokeWidth: 2,
    opacity: 0.8,
    visible: true,
    zIndex: 12,
    groupId: "group_walls_001",
    createdAt: "2025-06-28T16:40:12.345Z",
    updatedAt: "2025-07-02T09:33:21.678Z",
    material: {
      materialId: "mat_45678",
      materialName: "Sage Green Paint",
      materialType: "color",
      color: "#D5F5E3",
      appliedAt: "2025-07-02T09:33:21.678Z"
    }
  },
  {
    id: "seg_008",
    name: "Hallway Wall",
    type: "wall",
    points: [
      { x: 350, y: 400 },
      { x: 500, y: 400 },
      { x: 500, y: 550 },
      { x: 350, y: 550 }
    ],
    fillColor: "#F9E79F",
    strokeColor: "#000000",
    strokeWidth: 2,
    opacity: 0.8,
    visible: true,
    zIndex: 12,
    groupId: "group_walls_001",
    createdAt: "2025-06-28T16:42:33.789Z",
    updatedAt: "2025-07-02T09:33:51.234Z",
    material: {
      materialId: "mat_56789",
      materialName: "Pale Yellow Paint",
      materialType: "color",
      color: "#F9E79F",
      appliedAt: "2025-07-02T09:33:51.234Z"
    }
  },
  {
    id: "seg_009",
    name: "Bathroom Floor",
    type: "floor",
    points: [
      { x: 150, y: 600 },
      { x: 300, y: 600 },
      { x: 300, y: 700 },
      { x: 150, y: 700 }
    ],
    fillColor: "#F4F6F7",
    strokeColor: "#000000",
    strokeWidth: 1,
    opacity: 0.9,
    visible: false, // This segment is hidden
    zIndex: 6,
    createdAt: "2025-06-29T11:15:45.678Z",
    updatedAt: "2025-07-03T08:25:19.012Z",
    material: {
      materialId: "mat_67890",
      materialName: "Marble Tile",
      materialType: "texture",
      previewUrl: "https://example.com/materials/marble-preview.jpg",
      textureUrl: "https://example.com/textures/marble-tile.jpg",
      appliedAt: "2025-07-03T08:25:19.012Z"
    }
  },
  {
    id: "seg_010",
    name: "Patio Deck",
    type: "floor",
    points: [
      { x: 350, y: 600 },
      { x: 650, y: 600 },
      { x: 650, y: 750 },
      { x: 350, y: 750 }
    ],
    fillColor: "#A04000",
    strokeColor: "#6E2C00",
    strokeWidth: 1.5,
    opacity: 0.85,
    visible: true,
    zIndex: 4,
    createdAt: "2025-06-30T15:22:33.456Z",
    updatedAt: "2025-07-01T12:10:45.789Z",
    material: {
      materialId: "mat_78901",
      materialName: "Composite Decking",
      materialType: "texture",
      previewUrl: "https://example.com/materials/decking-preview.jpg",
      textureUrl: "https://example.com/textures/composite-decking.jpg",
      appliedAt: "2025-07-01T12:10:45.789Z"
    }
  }
];
