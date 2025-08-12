import { Helmet } from "react-helmet-async";

const Analytics = () => {
  return (
    <section>
      <Helmet>
        <title>DevManage – Analytics</title>
        <meta name="description" content="Visualize performance and revenue analytics in DevManage." />
        <link rel="canonical" href="/analytics" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-2">Analytics</h1>
      <p className="text-muted-foreground">Rich analytics and dashboards are coming soon.</p>
    </section>
  );
};

export default Analytics;
