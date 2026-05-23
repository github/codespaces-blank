-- 1. EXTENSIONS & FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. TABLES
-- Table: profiles
CREATE TABLE public.profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name     TEXT NOT NULL,
  dni           TEXT,
  phone         TEXT,
  role          TEXT DEFAULT 'user', -- 'user' | 'admin' | 'committee'
  status        TEXT DEFAULT 'active', -- 'active' | 'suspended' | 'deleted'
  gdpr_consent  BOOLEAN DEFAULT false,
  gdpr_date     TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Table: books
CREATE TABLE public.books (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  author        TEXT,
  category      TEXT,
  language      TEXT DEFAULT 'es',
  isbn          TEXT,
  status        TEXT DEFAULT 'available',
  condition     TEXT DEFAULT 'good',
  cover_url     TEXT,
  summary       TEXT,
  sponsor_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  origin        TEXT,
  replacement_cost DECIMAL(6,2),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Table: loans
CREATE TABLE public.loans (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  book_id         UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  status          TEXT DEFAULT 'reserved',
  reserved_at     TIMESTAMPTZ DEFAULT NOW(),
  collected_at    TIMESTAMPTZ,
  due_date        TIMESTAMPTZ,
  returned_at     TIMESTAMPTZ,
  renewals        INT DEFAULT 0,
  warnings_sent   INT DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Table: loan_agreements
CREATE TABLE public.loan_agreements (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_id         UUID REFERENCES public.loans(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id         UUID REFERENCES public.books(id) ON DELETE CASCADE,
  signed_at       TIMESTAMPTZ DEFAULT NOW(),
  ip_address      TEXT,
  user_agent      TEXT,
  checkbox_accepted BOOLEAN NOT NULL,
  signature_url   TEXT,
  pdf_url         TEXT,
  agreement_text  TEXT
);

-- Add agreement_id reference to loans table
ALTER TABLE public.loans ADD COLUMN agreement_id UUID REFERENCES public.loan_agreements(id) ON DELETE SET NULL;

-- Table: payments_pool
CREATE TABLE public.payments_pool (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type        TEXT NOT NULL,
  concept     TEXT NOT NULL,
  amount      DECIMAL(8,2) NOT NULL,
  donor_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  receipt_url TEXT,
  created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Table: donations_pending
CREATE TABLE public.donations_pending (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_title    TEXT NOT NULL,
  book_author   TEXT,
  notes         TEXT,
  status        TEXT DEFAULT 'pending',
  reviewer_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  review_notes  TEXT,
  reviewed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRIGGERS FOR updated_at
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_loans_updated_at BEFORE UPDATE ON public.loans FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 4. TRIGGER FOR AUTO-CREATING PROFILES ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations_pending ENABLE ROW LEVEL SECURITY;

-- 5.1 RLS Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can do everything on profiles" ON public.profiles FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5.2 RLS Policies for Books
CREATE POLICY "Books are viewable by everyone" ON public.books FOR SELECT USING (true);
CREATE POLICY "Admins can do everything on books" ON public.books FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5.3 RLS Policies for Loans
CREATE POLICY "Users can view their own loans" ON public.loans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own loans" ON public.loans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can do everything on loans" ON public.loans FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5.4 RLS Policies for Loan Agreements
CREATE POLICY "Users can view their own agreements" ON public.loan_agreements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own agreements" ON public.loan_agreements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can do everything on agreements" ON public.loan_agreements FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5.5 RLS Policies for Payments Pool
CREATE POLICY "Admins can do everything on payments" ON public.payments_pool FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5.6 RLS Policies for Donations Pending
CREATE POLICY "Users can view their own donations" ON public.donations_pending FOR SELECT USING (auth.uid() = donor_id);
CREATE POLICY "Users can insert their own donations" ON public.donations_pending FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "Admins/Committee can do everything on donations" ON public.donations_pending FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'committee')));

-- 6. STORAGE BUCKETS (Need to be created manually or via Supabase dashboard as SQL function auth is limited)
-- Note: Buckets "acuerdos-pdf", "firmas", "portadas" must be created.
