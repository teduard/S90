import appExpense from '/assets/expense.png';
import appTaskify from '/assets/taskify.png';
import appFitness from '/assets/fitness.svg';
import { Box } from "@cloudscape-design/components";
import ProductCard from "./ProductCard";
import { ExpenseRoutes } from '../routes';

function RelatedProducts() {
  return (
    <section className="page-section" aria-label="Related products and services">
      <Box variant="h2" margin={{ bottom: 'm' }}>
        <span id="related-products">S90 products</span>
      </Box>
      <ul className="product-cards-list">
        <ProductCard
          title="Expense"
          logo={appExpense}
          description="Have an overview of your expense items, monthly situation and other metrics at a quick glance. This dashboard experience let's you make decisions quickly."
          active={true}
          link={`${import.meta.env.BASE_URL}${ExpenseRoutes.path}`}
        />
        <ProductCard
          title="Taskify"
          logo={appTaskify}
          description="Keeps your day on track with an innovative way of scheduling your task. Set estimates and see how long a task actually took."
          active={false}
        />
        <ProductCard
          title="Fitness"
          logo={appFitness}
          description="Simplify your fitness goals by setting a routing you can actually stick to. Configure your favourite exercices and achive your goals."
          active={false}
        />
        
      </ul>
    </section>
  );
}

export default RelatedProducts;