# SEN12MS data provenance

The application does not redistribute imagery. Download the research dataset from the [Technical University of Munich media repository](https://mediatum.ub.tum.de/1474000) and use the splits and utilities from the [authors' SEN12MS toolbox](https://github.com/schmitt-muc/SEN12MS).

SEN12MS contains aligned Sentinel-1 SAR, Sentinel-2 multispectral, and MODIS-derived land-cover patches. Cite Schmitt, Hughes, Qiu, and Zhu (2019), DOI `10.5194/isprs-annals-IV-2-W7-153-2019` when appropriate. Review the repository and dataset terms before redistribution or commercial use; this portfolio intentionally ships code and metadata rather than image copies.

Create an NPZ for `ml/train.py` with float arrays named `sar` (`N × 2 × H × W`) and `optical` (`N × 13 × H × W`). Keep spatially disjoint hold-out scenes so neighboring patches cannot leak across train and evaluation sets.

The manual `Train paired-sensor model` GitHub Actions workflow accepts an HTTPS URL and required SHA-256 for that NPZ. The cloud runner verifies the checksum, trains the dual encoder, exports normalized embeddings, computes metrics from the held-out pairs, and uploads the model, embeddings, and metric JSON as one workflow artifact. No large download or training is performed during Vercel requests or on the local portfolio machine.
