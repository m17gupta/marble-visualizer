import { Button } from '@/components/ui/button';
import GenAiImages from './GenAiImages';


const AllGenAiImage = () => {

  //   


  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-md font-semibold mb-4">Design Variations</h2>

      {/* Generated images grid */}
      <GenAiImages />

      {/* Empty state */}
      {/* {genAiImages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="text-xl font-medium mb-2">No designs generated yet</h3>
          <p className="text-gray-600 max-w-md">
            Add a photo of your house, select a style preference, and click "Visualize" to see AI-generated design options.
          </p>
        </div>
      )} */}

      {/* Loading state */}
      {/* {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Generating designs...</p>
        </div>
      )} */}

      {/* Cancel and Save & Continue buttons */}
      <div className="mt-6 flex justify-between">
        <Button
          className="px-4 py-2 border border-gray-300 text-gray-700 bg-transparent rounded-lg hover:bg-gray-50"
        >
          Cancel
        </Button>


        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:text-gray-500"
        // disabled={!selectedImageId}
        >
          Save & Continue To Next Step
        </Button>

      </div>
    </div>
  );
};

export default AllGenAiImage;
