// src/pages/NotFound.tsx
// This is a reusable template for dummy pages
interface NotFoundProps {
    title: string;
  }
  
  export const NotFound: React.FC<NotFoundProps> = ({ title }) => {
    return (
      <div className="p-4">
        <div className="bg-base-200 rounded-lg p-6">
          <p className="text-lg">This is the {title} page. Content coming soon!</p>
        </div>
      </div>
    );
};
  
export default NotFound;