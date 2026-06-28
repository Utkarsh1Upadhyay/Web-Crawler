import express from "express";
import Crawler from "./crawler.js";

const router = express.Router();
const jobs = {};

router.post("/crawl", async (req, res) => {
    const { urls, concurrency } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ error: "Url is an empty array" });
    }

    const jobId = crypto.randomUUID();
    jobs[jobId] =
    {
        status:"running",
        total:urls.length,
        results:[]
    };

    res.json({ jobId });

    const crawler = new Crawler(concurrency || 5);
    const result = await crawler.crawl(urls);

    jobs[jobId].status = "done";
    jobs[jobId].results = result;
})

router.get("/results/:jobId", (req, res) => {
    const job = jobs[req.params.jobId];
    if (!job) {
        return res.status(404).json({ error: "Job Id doesn't exist" });
    }
    else {
        res.json({
            status: job.status,
            total: job.total,
            results: job.results
        });
    }
})

export default router;
