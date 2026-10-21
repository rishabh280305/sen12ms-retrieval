# Deployment

Vercel requires managed `DATABASE_URL` and secret `AUTH_SECRET` values. Model training is not a deployment step; run `python ml/train.py --data <paired.npz>` on Colab or another suitable compute environment, inspect `metrics.json`, and only publish model claims after reproducing them.

GitHub CI runs JavaScript lint, unit tests, a production build, and Python syntax compilation. The manual **Production E2E** workflow installs Chromium on GitHub infrastructure and exercises authentication plus the evaluator at the stable Vercel URL.
